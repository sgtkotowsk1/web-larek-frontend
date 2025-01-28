import {
	IBasket,
	IOrder,
	IProduct,
	OrderForm,
	PaymentMethod,
} from '../../types';
import { IEvents } from '../base/events';

export type CatalogChangeEvent = {
	catalog: IProduct[];
};

export class AppState {
	productList: IProduct[] = [];
	basket: IBasket = { items: [], total: 0 };
	selectedProduct?: IProduct;
	currentOrder: IOrder = this._createEmptyOrder();
	private validationErrors: Partial<Record<keyof OrderForm, string>> = {};

	constructor(private eventManager: IEvents) {}

	// методы для работы с каталогом
	previewProduct(item: IProduct): void {
		this.selectedProduct = item;
		this.eventManager.emit('preview:changed', item);
	}

	updateProductList(products: IProduct[]): void {
		this.productList = products;
		this.eventManager.emit('items:changed', { catalog: products });
	}

	// методы для работы с корзиной
	isProductInBasket(product: IProduct): boolean {
		return this.basket.items.includes(product.id);
	}

	addToBasket(product: IProduct): void {
		this.basket.items.push(product.id);
		this.basket.total += product.price;
		this._notifyBasketUpdated();
	}

	removeFromBasket(product: IProduct): void {
		this.basket.items = this.basket.items.filter((id) => id !== product.id);
		this.basket.total = Math.max(0, this.basket.total - product.price);
		this._notifyBasketUpdated();
	}

	clearBasket(): void {
		this.basket = { items: [], total: 0 };
		this._notifyBasketUpdated();
	}

	// остальные методы
	setPaymentType(paymentType: PaymentMethod): void {
		this.currentOrder.payment = paymentType;
		this._validateOrder();
	}

	updateOrderField(field: keyof OrderForm, value: string): void {
		if (field === 'payment') {
			this.setPaymentType(value as PaymentMethod);
		} else {
			this.currentOrder[field] = value;
			this._validateOrder();
		}
	}

	validateOrder(): boolean {
		this._validateOrder();
		const isValid = this._isOrderValid();

		if (isValid) {
			this.currentOrder.total = this.basket.total;
			this.currentOrder.items = this.basket.items;
		}

		return isValid;
	}

	// методы для валидации
	private _validateOrder(): void {
		this.validationErrors = {};

		if (!this._isValidEmail(this.currentOrder.email)) {
			this.validationErrors.email = 'Укажите корректный email';
		}

		if (!this._isValidPhone(this.currentOrder.phone)) {
			this.validationErrors.phone = 'Укажите номер телефона';
		}

		if (!this.currentOrder.address) {
			this.validationErrors.address = 'Укажите адрес доставки';
		}

		this.eventManager.emit('formErrors:change', this.validationErrors);
	}

	private _isOrderValid(): boolean {
		return Object.keys(this.validationErrors).length === 0;
	}

	private _isValidEmail(email: string): boolean {
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		return emailRegex.test(email);
	}

	private _isValidPhone(phone: string): boolean {
		const sanitizedPhone = phone.replace(/\s+/g, '');
		const phoneRegex = /^(?:\+7|8)\d{10}$/;
		return (
			phoneRegex.test(sanitizedPhone) &&
			sanitizedPhone.length >= 11 &&
			sanitizedPhone.length <= 12
		);
	}

	// утилиты
	private _createEmptyOrder(): IOrder {
		return {
			email: '',
			phone: '',
			address: '',
			payment: 'card',
			total: 0,
			items: [],
		};
	}

	private _notifyBasketUpdated(): void {
		this.eventManager.emit('basket:updated', this.basket);
	}
}
