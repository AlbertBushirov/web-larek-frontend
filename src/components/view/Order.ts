import { IOrder } from '../../types/index';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from './Form';

// Модалньое окно с адресом доставки
export class OrderAddress extends Form<IOrder> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _address: HTMLInputElement;
	protected _contactButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._contactButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.container
		);
		this._address = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.container
		);
		this._cash = ensureElement<HTMLButtonElement>(
			'.button.button_alt[name="cash"]',
			this.container
		);

		this._card = ensureElement<HTMLButtonElement>(
			'.button.button_alt[name="card"]',
			this.container
		);

		this._card.addEventListener('click', () => {
			this._setPaymentMethod('card');
		});

		this._cash.addEventListener('click', () => {
			this._setPaymentMethod('cash');
		});
	}

	private _setPaymentMethod(payment: string) {
		this.toggleClass(this._card, 'button_alt-active', payment === 'card');
		this.toggleClass(this._cash, 'button_alt-active', payment === 'cash');
		this.onInputChange('payment', payment);
		this.events.emit('order_change_payment_type', { payment });
	}

	set address(value: string) {
		this._address.value = value;
	}
}

// Модальное окно с телефоном и Email
export class OrderContacts extends Form<IOrder> {
	protected _phoneInput: HTMLInputElement;
	protected _emailInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._phoneInput = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
		this._emailInput = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;
	}

	set phone(value: string) {
		this._phoneInput.value = value;
	}

	set email(value: string) {
		this._emailInput.value = value;
	}
}
