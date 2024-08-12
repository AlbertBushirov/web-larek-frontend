import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import {
	AppData,
	CatalogChangeEvent,
	IOrderForm,
} from './components/data/AppData';
import { Card } from './components/View/Card';
import { ExtensionApi } from './components/data/ExtensionApi';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/View/Page';
import { ICardItem, IOrder, EventTypes } from './types/index';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { OrderAddress, OrderContacts } from './components/View/Order';
import { Success } from './components/View/Success';

const events = new EventEmitter();
const api = new ExtensionApi(CDN_URL, API_URL);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppData({}, events);
const page = new Page(document.body, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const deliveryOrderForm = new OrderAddress(
	cloneTemplate(orderTemplate),
	events
);
const contactOrderForm = new OrderContacts(
	cloneTemplate(contactsTemplate),
	events
);

events.on<CatalogChangeEvent>(EventTypes.ITEMS_CHANGED, () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit(EventTypes.CARD_SELECT, item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

events.on(EventTypes.CARD_SELECT, (item: ICardItem) => {
	appData.setPreview(item);
});

events.on(EventTypes.PREVIEW_CHANGED, (item: ICardItem) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!item.inBasket) {
				events.emit(EventTypes.BASKET_ADD, item);
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
		card.disableButton(true);
	}
});

events.on(EventTypes.BASKET_ADD, (item: ICardItem) => {
	item.inBasket = true;
	appData.addBasket(item);
	page.counter = appData.basket.length;
	modal.close();
});

events.on(EventTypes.PRODUCT_DELETE, (item: ICardItem) => {
	item.inBasket = false;
	appData.removeBasket(item);
	page.counter = appData.basket.length;
});

events.on(EventTypes.BASKET_CHANGED, (items: ICardItem[]) => {
	basket.items = items.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit(EventTypes.PRODUCT_DELETE, item),
					(item.inBasket = false),
					appData.removeBasket(item);
				page.counter = appData.basket.length;
			},
		});
		return card.render({
			id: item.id,
			title: item.title,
			price: item.price,
			index: `${index + 1}`,
		});
	});
	basket.total = appData.getTotalPrice();
	appData.order.total = appData.getTotalPrice();
});

//Открытие корзицы товаров
events.on(EventTypes.BASKET_OPEN, () => {
	modal.render({
		content: basket.render({}),
	});
});

// открытие окна заказа
events.on(EventTypes.ORDER_OPEN, () => {
	modal.render({
		content: deliveryOrderForm.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(EventTypes.FORM_ERRORS_CHANGE, (errors: Partial<IOrder>) => {
	const { payment, address, email, phone } = errors;

	deliveryOrderForm.valid = !payment && !address;
	deliveryOrderForm.errors = Object.values({ payment, address }).filter(
		(i) => !!i
	);

	contactOrderForm.valid = !email && !phone;
	contactOrderForm.errors = Object.values({ email, phone }).filter((i) => !!i);
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

events.on(EventTypes.ORDER_READY, () => {
	deliveryOrderForm.valid = true;
});

events.on(EventTypes.ORDER_SUBMIT, () => {
	modal.render({
		content: contactOrderForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(EventTypes.CONTACTS_READY, () => {
	contactOrderForm.valid = true;
});

events.on(EventTypes.CONTACTS_SUBMIT, () => {
	appData.orderData();
	const orderWithItems = {
		...appData.order,
		items: appData.basket.map((item) => item.id),
	};

	api
		.orderCards(orderWithItems)
		.then((res) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			appData.resetOrderForm();
			appData.clearBasket();
			page.counter = appData.basket.length;
			success.result = res.total.toString();
			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error('Ошибка при отправке заказа:', err);
		});
});

// Блокировка прокрутки страницы
events.on(EventTypes.MODAL_OPEN, () => {
	page.locked = true;
});

events.on(EventTypes.MODAL_CLOSE, () => {
	page.locked = false;
});

// Данные о товарах с сервера
api
	.getCardList()
	.then(appData.setCatalog.bind(appData))
	.catch((error) => {
		console.error(error);
	});
