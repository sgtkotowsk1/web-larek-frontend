import { Component } from './base/Component';
import { createElement, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';
import { uiConfig } from '../utils/constants';

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>(
			`.${uiConfig.basket.list}`,
			this.container
		);
		this._total = this.container.querySelector(
			`.${uiConfig.basket.totalPrice}`
		);
		this._button = this.container.querySelector(
			`${uiConfig.basket.actionButton}`
		) as HTMLButtonElement;

		if (this._button) {
			this._button.addEventListener('click', () => {
				this.events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length > 0) {
			this._renderItems(items);
			this.setDisabled(this._button, false);
		} else {
			this._renderEmptyState();
			this.setDisabled(this._button, true);
		}
	}

	private _renderItems(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
	}

	private _renderEmptyState() {
		const emptyMessage = createElement<HTMLParagraphElement>('p', {
			textContent: 'Пока здесь ничего нет...',
		});
		this._list.replaceChildren(emptyMessage);
	}

	set total(total: number) {
		this.setText(this._total, total + ' синапсов');
	}
}
