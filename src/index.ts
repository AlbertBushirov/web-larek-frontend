import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { ICardItem, IOrder } from './types/index';
import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/data/ExtensionApi';
import {
	AppData,
	CatalogChangeEvent,
	IOrderForm,
} from './components/data/AppData';
import { Card } from './components/View/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { OrderAddress, OrderContacts } from './components/View/Order';
import { Success } from './components/View/Success';

//Управление событиями и API
const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

//Переменные
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация состояния приложения
const appData = new AppData({}, events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderAddress(cloneTemplate(orderTemplate), events);
const contacts = new OrderContacts(cloneTemplate(contactsTemplate), events);

// Обработчик изменения каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

//Выбор товара
events.on('card:select', (item: ICardItem) => {
	appData.setPreview(item);
});

//Добавление продукта в корзину
events.on('basket:add', (item: ICardItem) => {
	appData.addBasket(item);
	page.counter = appData.basket.length;
	modal.close();
});

events.on('product:delete', (item: ICardItem) => {
	item.inBasket = false;
	appData.updateBasket(item);
	page.counter = appData.basket.length;
});

// Обработчик изменения в корзине и обновления общей стоимости
events.on('basket:changed', (items: ICardItem[]) => {
	let total = 0;
	basket.items = items.map((item) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('product:delete', item),
					(item.inBasket = false),
					appData.updateBasket(item);
				page.counter = appData.basket.length;
			},
		});
		total += item.price;
		return card.render({
			title: item.title,
			price: item.price,
		});
	});
	basket.total = total;
	appData.order.total = total;
});

//Открытие корзицы товаров
events.on('basket:open', () => {
	modal.render({
		content: basket.render({}),
	});
});

// открытие окна заказа
events.on('order:open', () => {
	modal.render({
		content: orderForm.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

events.on('order:ready', () => {
	orderForm.valid = true;
});

events.on('contacts:ready', () => {
	contacts.valid = true;
});

events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address, email, phone } = errors;
	orderForm.valid = !payment && !address;
	orderForm.errors = Object.values({ payment, address }).filter((i) => !!i);

	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone }).filter((i) => !!i);
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Обработчик открытия модального окна контактов
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	appData.orderData();
	const orderDone = {
		...appData.order,
		items: appData.basket.map((item) => item.id),
	};
	api
		.orderCards(orderDone)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			appData.clearOrder();
			appData.clearBasket();
			page.counter = appData.basket.length;
			success.total = result.total.toString();
			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error('Ошибка при отправке заказа:', err);
		});
});

// Обработчик изменения предпросмотра продукта и добавления в корзину
events.on('preview:changed', (item: ICardItem) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!item.inBasket) {
				events.emit('basket:add', item);
			}
			if (appData.inBasket(item)) {
				card.activeButton;
			} else {
				appData.inBasket(item);
				card.disableButton;
			}
		},
	});
	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			inBasket: item.inBasket,
		}),
	});
	if (item.price === null) {
		card.disableButton(null);
	}
});

// Блокировка прокрутки страницы
events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

//Получаем массив товаров с сервера
api
	.getCardList()
	.then(appData.setCatalog.bind(appData))
	.catch((error) => {
		console.error(error);
	});
