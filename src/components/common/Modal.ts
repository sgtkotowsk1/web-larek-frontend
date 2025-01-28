import { Component } from '../base/Compontent';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { uiConfig } from '../../utils/constants';

export interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			`.${uiConfig.modal.closeButton}`,
			container
		);
		this._content = ensureElement<HTMLElement>(
			`.${uiConfig.modal.content}`,
			container
		);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add(`${uiConfig.modal.active}`);
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove(`${uiConfig.modal.active}`);
		this.content = null;
		this.events.emit('modal:close');
	}
}
