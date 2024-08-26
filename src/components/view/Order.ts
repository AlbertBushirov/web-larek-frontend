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
	protected _paymentContainer: HTMLDivElement;
	protected _paymentButton: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		// Находим элементы формы в контейнере
		this._paymentContainer = ensureElement<HTMLDivElement>(
			'.order__buttons',
			this.container
		);
		this._paymentButton = Array.from(
			this._paymentContainer.querySelectorAll('.button_alt')
		);
		this._addressInput = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;

		// Добавляем обработчик событий на контейнер кнопок оплаты
		this._paymentContainer.addEventListener('click', (e: MouseEvent) => {
			const target = e.target as HTMLButtonElement;
			this.setToggleClassPayment(target.name);
			events.emit(`order.payment:change`, { target: target.name });
		});

		this._cash = ensureElement<HTMLButtonElement>(
			'.button.button_alt[name="cash"]',
			this.container
		);

		this._card = ensureElement<HTMLButtonElement>(
			'.button.button_alt[name="card"]',
			this.container
		);
	}

	//Переключение классов кнопки оплаты
	setToggleClassPayment(className: string) {
		this._paymentButton.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === className);
		});
	}

	/**
	 * Установка значения адреса.
	 * @param {string} value - Новое значение адреса.
	 */
	set address(value: string) {
		this._addressInput.value = value;
	}

	resetButtonState() {
		this.toggleClass(this._cash, 'button_alt-active', false);
		this.toggleClass(this._card, 'button_alt-active', false);
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
