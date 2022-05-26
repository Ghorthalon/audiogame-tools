import { BaseItem } from './base-item';

export class EditItem extends BaseItem {
	private contents: string;
	private label: HTMLLabelElement;
	private editField: HTMLInputElement;
	public constructor(
		id: string,
		title: string,
		private initialText: string,
		private isPassword: boolean = false
	) {
		super(id, title);
		this.contents = initialText;
	}

	public getDOMNode(): HTMLElement {
		const node = document.createElement('div');
		const label: HTMLLabelElement = document.createElement('label');
		label.setAttribute('for', `edit_${this.id}`);
		label.textContent = this.title;
		const editField = document.createElement('input');
		editField.id = `edit_${this.id}`;
		editField.value = this.contents;
		editField.addEventListener('keydown', this.onChange.bind(this));
		editField.addEventListener('focus', this.onFocus.bind(this));
		if (this.isPassword) {
			editField.type = 'password';
		}
		node.appendChild(label);
		node.appendChild(editField);
		node.addEventListener('focus', this.onFocus.bind(this));
		this.editField = editField;
		this.label = label;
		this.container = node;
		return node;
	}

	public getContents(): string {
		return this.editField.value;
	}

	private onChange(event: Event) {
		this.emit('update', {
			type: 'edit',
			value: this.editField.value
		});
	}

	public focus(): void {
		this.editField && this.editField.focus();
	}
}
