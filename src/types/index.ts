// Приложение
export interface IProductItem {
	basket: IBasket[];
	cardsList: ICardItem[];
	preview: string | null;
	order: IOrder | null;
	image: string;
}

// Товар
export interface ICardItem {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
	inBasket: boolean;
}

// Данные заказа
export interface IOrder {
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
	id: string[];
}

// Корзина
export interface IBasket {
	quantity: number;
	title: string;
	price: number;
	totalPrice: number;
}

// Тип ошибок формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;
