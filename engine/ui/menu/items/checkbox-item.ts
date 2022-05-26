import { BaseItem } from './base-item';

export class CheckboxItem extends BaseItem {
	private checkboxElement: HTMLInputElement;
	private label: HTMLElement;
	public constructor(id: string, title: string) {
		super(id, title);
	}

	public getDOMNode(): HTMLElement {
		this.container = document.createElement('div');
		this.label = document.createElement('label');
		this.label.setAttribute('for', `chkbx_${this.id}`);
		this.label.textContent = this.title;
		this.checkboxElement = document.createElement('input');
		this.checkboxElement.setAttribute('type', 'checkbox');
		this.checkboxElement.setAttribute('id', `chkbx_${this.id}`);
		this.checkboxElement.addEventListener('focus', this.onFocus.bind(this));
		this.checkboxElement.addEventListener('change', this.onChange.bind(this));
		this.container.appendChild(this.label);
		this.container.appendChild(this.checkboxElement);
		return this.container;
	}

	public getContents(): boolean {
		return this.checkboxElement.checked;
	}

	private onChange(event: Event) {
		this.emit('update', {
			type: 'checkbox',
			value: this.checkboxElement.checked
		});
	}

	public focus(): void {
		this.checkboxElement.focus();
	}
}
