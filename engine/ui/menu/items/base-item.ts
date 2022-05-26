import * as EventEmitter from 'eventemitter3';

export class BaseItem extends EventEmitter {
	protected container: HTMLElement;
	public constructor(protected id: string, protected title: string) {
		super();
	}

	public getDOMNode(): HTMLElement {
		let node = document.createTextNode(this.title);
		let element = document.createElement('div');
		element.appendChild(node);
		return element;
	}

	public getContents(): void {
		return;
	}

	protected onFocus(event: Event) {
		this.emit('focus', this.id);
	}

	public focus(): void {
		this.container && this.container.focus();
	}

	public click(): void {
		return;
	}
	public getID(): string {
		return this.id;
	}
}
