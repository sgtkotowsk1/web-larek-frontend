import { Component } from './base/Compontent';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { uiConfig } from '../utils/constants';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>(
			`.${uiConfig.header.basket.counterClass}`
		);
		this._catalog = ensureElement<HTMLElement>(`.${uiConfig.gallery}`);
		this._wrapper = ensureElement<HTMLElement>(`.${uiConfig.page.wrapper}`);
		this._basket = ensureElement<HTMLElement>(
			`.${uiConfig.header.basket.class}`
		);

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add(`${uiConfig.page.locked}`);
		} else {
			this._wrapper.classList.remove(`${uiConfig.page.locked}`);
		}
	}
}
