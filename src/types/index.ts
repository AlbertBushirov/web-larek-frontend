// Товар
export interface Iproduct {
id: string;
title: string;
price: number;
image: string;
description: string;
category: string;
payment: string;
address: string;
}

// Покупатель
export interface Ibuyer {
email: string;
phone: number;
}

// Корзина 
export interface Ibasket {
items: HTMLElement[];
total: number;
}

// Заказ 
export interface IOrder {
payment: string;
address: string;
}
