import { IProduct } from '../types';
import { Component } from './base/Compontent';
import { uiConfig } from '../utils/constants';
import { ensureElement } from '../utils/utils';

interface IProductActions {
	onClick: (e: MouseEvent) => void;
	onRemove?: () => void;
}

export default class Product extends Component<IProduct> {
	protected _description?: HTMLParagraphElement;
	protected _price: HTMLSpanElement;
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _category?: HTMLSpanElement;
	protected _button?: HTMLButtonElement;
	protected _index?: HTMLSpanElement;

	protected _categoryColor: { [key: string]: string } = {
		'софт-скил': '_soft',
		'хард-скил': '_hard',
		другое: '_other',
		дополнительное: '_additional',
		кнопка: '_button',
	};

	constructor(container: HTMLElement, actions?: IProductActions) {
		super(container);
		this._title = ensureElement<HTMLElement>(
			`.${uiConfig.card.title}`,
			container
		);
		this._price = ensureElement<HTMLSpanElement>(
			`.${uiConfig.card.price}`,
			container
		);

		this._description = container.querySelector(
			`.${uiConfig.card.text}`
		) as HTMLParagraphElement;
		this._category = container.querySelector(
			`.${uiConfig.card.category}`
		) as HTMLSpanElement;
		this._button = container.querySelector(
			`.${uiConfig.card.button}`
		) as HTMLButtonElement;
		this._image = container.querySelector(
			`.${uiConfig.card.image}`
		) as HTMLImageElement;

		this._index = container.querySelector(
			`.${uiConfig.basket.itemIndex}`
		) as HTMLSpanElement;

		if (typeof actions?.onClick === 'function') {
			const target = this._button || container;

			target.addEventListener('click', actions.onClick);
		}
	}
	get id(): string {
		return this.container.dataset.id || '';
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get title() {
		return this._title.textContent || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get description() {
		return this.container.textContent || '';
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: string) {
		this.setText(this._category, value);

		this._category?.classList?.forEach((className) => {
			if (className.startsWith('card__category_')) {
				this._category?.classList?.remove(className);
			}
		});

		const categoryClass = this._categoryColor[value].toLowerCase();
		if (categoryClass) {
			this._category?.classList?.add(`card__category${categoryClass}`);
		}
	}
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}

	set index(value: string) {
		this.setText(this._index, value);
	}

	get price() {
		return this._price.textContent || '';
	}

	set price(value: string) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');

		if (this._button) {
			this._button.disabled = !value;
		}
	}
}
