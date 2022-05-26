import { BaseItem } from './base-item';

export class MenuItem extends BaseItem {
	private button: HTMLButtonElement;
	public constructor(id: string, title: string) {
		super(id, title);
	}

	public getDOMNode(): HTMLElement {
		const container = document.createElement('div');
		const button = document.createElement('button');
		button.textContent = this.title;
		button.addEventListener('click', this.handleClick.bind(this));
		button.addEventListener('focus', this.onFocus.bind(this));
		container.appendChild(button);
		this.container = container;
		this.button = button;

		return container;
	}

	public getContents(): string {
		return this.id;
	}

	private handleClick(event: Event) {
		this.emit('choose', this.id);
	}

	public focus(): void {
		this.button && this.button.focus();
	}

	public click(): void {
		this.button.click();
	}
}
