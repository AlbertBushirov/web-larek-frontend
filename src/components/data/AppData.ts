import { FormErrors, ICardItem, IProductItem, IOrder } from '../../types';
import { Model } from '../base/Model';

//Изменение каталога
export type CatalogChangeEvent = {
	catalog: ICardItem[];
};

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export class AppData extends Model<IProductItem> {
	basket: ICardItem[] = [];
	items: ICardItem[];
	catalog: ICardItem[];
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		id: [],
		items: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	//Добавить товар в корзину
	addBasket(value: ICardItem) {
		if (!this.basket.some((item) => item.id === value.id)) {
			this.basket.push(value);
			this.emitChanges('basket:changed', this.basket);
		}
	}

	inBasket(item: ICardItem) {
		return this.order.items.includes(item.id);
	}

	//Очистить корзину
	clearBasket() {
		this.basket = [];
		this.order.id = [];
	}

	//Обновить корзину
	updateBasket(value: ICardItem) {
		this.basket = this.basket.filter((item) => item !== value);
		this.emitChanges('basket:changed', this.basket);
	}

	//Удаление продукта из корзины
	removeFromBasket(id: string) {
		this.basket = this.basket.filter((it) => it.id !== id);
		this.emitChanges('basket:changed');
	}

	//очистка заказа
	clearOrder() {
		this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			total: 0,
			id: [],
			items: [],
		};
	}

	getTotalPrice() {
		return this.basket.reduce((total, item) => total + item.price, 0);
	}

	//Добавление каталога карточек на главную страницу
	setCatalog(items: ICardItem[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	//Предпросмотр продукта validateOrder
	setPreview(item: ICardItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrderField(item: keyof IOrderForm, value: string) {
		this.order[item] = value;
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		if (this.validateContact()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	//Валидация формы с контактами
	validateContact(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'укажите email';
		}
		if (!this.order.phone) {
			errors.phone = 'укажите телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactFormError:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	//Валидация формы доставки.
	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Укажите способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Укажите адрес';
		}
		this.formErrors = errors;
		this.events.emit('deliveryFormError:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	orderData() {
		this.order.id = [];
		this.basket.forEach((item) => {
			this.order.id.push(item.id);
		});
		this.order.total = this.getTotalPrice();
	}
}
