import './scss/styles.scss';
import { AppState, CatalogChangeEvent } from './components/special/appData';

import { EventEmitter } from './components/base/events';
import Product from './components/Product';
import WebLarekApi from './components/special/WebLarekApi';

import { ContactForm, IProduct, OrderForm } from './types';
import { API_URL, CDN_URL, uiConfig } from './utils/constants';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { IFormState } from './components/common/Form';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppState(events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const templates = document.querySelectorAll('template');

interface ITemplates {
	[key: string]: HTMLTemplateElement;
}

const TEMPLATES: ITemplates = {};

templates.forEach((template: HTMLTemplateElement) => {
	const templateId = template.id;
	if (templateId) {
		TEMPLATES[templateId] = template;
	}
});

const basket = new Basket(cloneTemplate(TEMPLATES['basket']), events);
const order = new Order(cloneTemplate(TEMPLATES['order']), events);
const contact = new Contacts(cloneTemplate(TEMPLATES['contacts']), events);
const success = new Success(cloneTemplate(TEMPLATES['success']), {onClick() {
	modal.close();
},})

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.productList.map((item: IProduct) => {
		const card = new Product(cloneTemplate(TEMPLATES['card-catalog']), {
			onClick: () => events.emit('product:selected', item),
		});
		return card.render(item);
	});
});

events.on('product:selected', (item: IProduct) => {
	appData.previewProduct(item);
});

events.on('preview:changed', (item: IProduct) => {
	const modalCardContent = new Product(
		cloneTemplate(TEMPLATES['card-preview']),
		{
			onClick: () => {
				if (!appData.isProductInBasket(item)) {
					appData.addToBasket(item);
				} else {
					appData.removeFromBasket(item);
				}
				modal.close();
			},
		}
	).render(item);
	const productInstance = new Product(modalCardContent);
	productInstance.updateButtonText(appData.isProductInBasket(item));
	modal.content = modalCardContent;
	modal.open();
});

events.on('basket:updated', () => {
	page.counter = appData.basket.items.length;

	basket.items = appData.basket.items.map((id, index) => {
		const item = appData.productList.find((item) => item.id === id);
		const card = new Product(cloneTemplate(TEMPLATES['card-basket']), {
			onClick: () => appData.removeFromBasket(item),
		});
		card.index = (index + 1).toString();
		return card.render(item);
	});

	basket.total = appData.basket.total;
});

events.on('basket:open', () => {
	const basketContent = basket.render();
	modal.content = basketContent;
	modal.open();
});

events.on('order:open', () => {
	const initialState: Partial<OrderForm> & IFormState = {
		valid: false,
		errors: [],
		address: '',
		payment: 'card',
	};
	const orderContent = order.render(initialState);
	modal.content = orderContent;
});

events.on('order:submit', () => {
	const initialState: Partial<ContactForm> & IFormState = {
		phone: '',
		email: '',
		valid: false,
		errors: [],
	};
	const contactsContent = contact.render(initialState);
	modal.content = contactsContent;
});

events.on('contacts:submit', () => {
	const order = {
		email: appData.currentOrder.email,
		phone: appData.currentOrder.phone,
		address: appData.currentOrder.address,
		payment: appData.currentOrder.payment,
		total: appData.basket.total,
		items: appData.basket.items,
	};

	api
		.orderItems(order)
		.then((data) => {
			const successContent = success.render({ total: data.total });
			modal.content = successContent;
			appData.clearBasket();
		})
		.catch((error) => {
			console.error(`Не удалось обработать заказ: ${error.message}`);
		});
});

events.on('formErrors:change', (errors: Partial<OrderForm>) => {
	const { payment, address, email, phone } = errors;

	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');

	contact.valid = !email && !phone;
	contact.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof OrderForm; value: string }) => {
		appData.updateOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof OrderForm; value: string }) => {
		appData.updateOrderField(data.field, data.value);
	}
);

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getList()
	.then(appData.updateProductList.bind(appData))
	.catch((err) => {
		console.error(err);
	});
