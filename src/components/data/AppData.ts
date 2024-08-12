import {
	EventTypes,
	FormErrors,
	ICardItem,
	IProductItem,
	IOrder,
} from '../../types';
import { Model } from '../base/Model';

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
	catalog: ICardItem[];
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		id: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	addBasket(value: ICardItem) {
		if (!this.basket.some((item) => item.id === value.id)) {
			this.basket.push(value);
			this.emitChanges(EventTypes.BASKET_CHANGED, this.basket);
		}
	}

	removeBasket(value: ICardItem) {
		this.basket = this.basket.filter((item) => item !== value);
		this.emitChanges(EventTypes.BASKET_CHANGED, this.basket);
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges(EventTypes.BASKET_CHANGED, this.basket);
	}

	getTotalPrice() {
		return this.basket.reduce((total, item) => total + item.price, 0);
	}

	setCatalog(items: ICardItem[]) {
		this.catalog = items;
		this.emitChanges(EventTypes.ITEMS_CHANGED, { catalog: this.catalog });
	}

	setPreview(item: ICardItem) {
		this.preview = item.id;
		this.emitChanges(EventTypes.PREVIEW_CHANGED, item);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		if (this.validateOrder()) {
			this.events.emit(EventTypes.ORDER_READY, this.order);
		}
	}

	setContactField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		if (this.validateContact()) {
			this.events.emit(EventTypes.CONTACTS_READY, this.order);
		}
	}

	validateContact() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (
			!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(this.order.email)
		) {
			errors.email = 'email должен быть в формате Ivanov@yandex.ru';
		}
		if (!this.order.phone) {
			errors.phone = 'Укажите телефон';
		} else if (!/^\+?[0-9]{7,19}$/.test(this.order.phone)) {
			errors.phone =
				'Номер телефона может начинаться с + и состоять только из цифр. Длинна от 7 до 14 цифр';
		}

		this.formErrors = errors;
		this.events.emit(EventTypes.FORM_ERRORS_CHANGE, this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Укажите способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Укажите адрес';
		}
		this.formErrors = errors;
		this.events.emit(EventTypes.FORM_ERRORS_CHANGE, this.formErrors);
		return Object.keys(errors).length === 0;
	}

	resetOrderForm() {
		this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			total: 0,
			id: [],
		};
	}

	orderData() {
		this.order.id = [];
		this.basket.forEach((item) => {
			this.order.id.push(item.id);
		});
		this.order.total = this.getTotalPrice();
	}
}
