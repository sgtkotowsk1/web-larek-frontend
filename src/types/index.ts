export interface IProduct {
	id: string;
	description: string;
	price: number | undefined;
	title: string;
	image: string;
	category: string;
}

export type PaymentMethod = 'cash' | 'card';

export interface IOrder {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number | undefined;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IBasket {
	items: string[];
	total: number;
}

export type OrderForm = Omit<IOrder, 'total' | 'items'>;

export type ContactForm = Omit<
	IOrder,
	'total' | 'items' | 'payment' | 'address'
>;
