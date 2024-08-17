import { IProductItem, IOrder } from '../../types';
import { Api, ApiListResponse } from '../base/api';

interface IOrderResult {
	id: string;
	total: number;
}

interface IAuctionAPI {
	getCardList(): Promise<IProductItem[]>;
	orderProducts(order: IOrder): Promise<IOrderResult>;
	orderCards(order: IOrder): Promise<IOrderResult>;
}

export class WebLarekAPI extends Api implements IAuctionAPI {
	readonly api: string;
	constructor(api: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.api = api;
	}

	getCardList() {
		return this.get('/product').then(
			(response: ApiListResponse<IProductItem>) => {
				return response.items.map((item) => {
					return { ...item, image: this.api + item.image };
				});
			}
		);
	}

	orderProducts(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then(
			(response: IOrderResult) => response
		);
	}

	orderCards(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
