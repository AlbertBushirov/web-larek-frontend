import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	index: string;
	inBasket: boolean;
	button: string;
}

export class Card<T> extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _category?: HTMLElement;
	protected _description?: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _buttonModal?: HTMLButtonElement;

	// Сопоставление категорий с ключами
	private categoryKey: Record<string, string> = {
		'софт-скил': '_soft',
		'хард-скил': '_hard',
		кнопка: '_button',
		дополнительное: '_additional',
		другое: '_other',
	};

	constructor(
		protected blockName: string,
		container: HTMLElement,
		action?: ICardActions
	) {
		super(container);

		this._category = container.querySelector('.card__category');
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._description = container.querySelector('.card__text');
		this._image = container.querySelector('.card__image');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button');

		// Добавляем обработчик события клика
		if (action?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', action.onClick);
			} else {
				container.addEventListener('click', action.onClick);
			}
		}
	}

	//Отключение кнопки
	disableButton(value: number | null) {
		if (!value && this._button) {
			this._button.disabled = true;
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	//Установка заголовка элемента
	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set buttonTitle(value: string) {
		if (this._button) {
			this.setText(this._button, value);
		}
	}

	set image(value: string) {
		if (this._image instanceof HTMLImageElement) {
			this._image.src = value;
			this._image.alt = this._title.textContent;
		}
	}

	//Проверка на 'Бесценно'
	set price(value: number | null) {
		this.setText(
			this._price,
			value ? `${value.toString()} синапсов` : 'Бесценно'
		);
		this.disableButton(value);
	}

	get price(): number {
		return Number(this._price.textContent || '');
	}

	//Описание карточки
	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	//Описание категории товара
	set category(value: string) {
		this.setText(this._category, value);
		const category = this._category.classList[0];
		this._category.className = '';
		this._category.classList.add(`${category}`);
		this._category.classList.add(`${category}${this.categoryKey[value]}`);
	}
}

export interface IBasketItem {
	title: string;
	price: number;
}

export class BasketElement extends Component<IBasketItem> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, index: number, action?: ICardActions) {
		super(container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this.setText(this._index, index + 1);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button');

		//Обработчик события клика для кнопки
		if (action?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', action.onClick);
			}
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	// Отображает цену товаров в корзине
	set price(value: number) {
		this.setText(this._price, `${value} синапсов`);
	}
}
