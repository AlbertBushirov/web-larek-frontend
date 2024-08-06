// Приложение
export interface IAppDate {
	catalog: IProductItem[];
	preview: string;
	basket: string[];
	order: IOrder;
	total: string | number;
	loading: boolean;
  }
  
  // Товар
  export interface IProductItem {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
  }
  
  // Данные заказа
  export interface IOrderForm {
  payment: string;
  address: string;
  phone: string;
  email: string;
  total: string | number;
  }
  
  export interface IProductsList {
	products: IProductItem[];
  }

  export interface IOrder extends IOrderForm {
	items: string[];
  }
  
  export type FormErrors = Partial<Record<keyof IOrder, string>>;
  
  export interface IOrderResult {
	id: string;
  }