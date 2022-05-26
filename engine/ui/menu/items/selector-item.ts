import { BaseItem } from './base-item';

export class SelectorItem extends BaseItem {
	private listContainer: HTMLUListElement;
	private fieldSet: HTMLFieldSetElement;
	private label: HTMLLegendElement;
	private entries: HTMLInputElement[] = [];
	private currentValue: SelectorEntry;
	public constructor(
		id: string,
		title: string,
		private items: SelectorEntry[]
	) {
		super(id, title);
	}

	public getDOMNode(): HTMLElement {
		this.container = document.createElement('div');
		this.listContainer = document.createElement('ul');
		this.label = document.createElement('legend');
		this.fieldSet = document.createElement('fieldset');
		this.fieldSet.setAttribute('class', 'radiogroup');
		this.fieldSet.id = `fs_selector_${this.id}`;
		const name = document.createTextNode(this.title);
		this.label.appendChild(name);
		this.fieldSet.appendChild(this.label);
		this.buildEntries();
		this.container.appendChild(this.fieldSet);
		this.container.addEventListener('focus', this.onFocus.bind(this));
		return this.container;
	}

	private buildEntries(): void {
		this.items.forEach((item, index) => {
			const node = document.createElement('input');
			node.type = 'radio';
			node.id = `${this.id}_${item.id}`;
			node.name = this.id;
			node.value = item.id || `${index}`;
			node.addEventListener('focus', this.onItemFocus.bind(this));
			node.addEventListener('select', this.onSelectItem.bind(this));
			node.addEventListener('change', this.onChangeItem.bind(this));
			this.entries.push(node);
			const label = document.createElement('label');
			label.setAttribute('for', `${this.id}_${item.id}`);
			label.textContent = item.title;
			this.fieldSet.append(node);
			this.fieldSet.append(label);
		});
	}

	private onItemFocus(event: FocusEvent) {
		console.log(`Item focused: `, event);
		this.emit('focus', this.id);
	}

	public getContents(): any {
		return this.currentValue;
	}

	private onSelectItem(event: Event) {}

	private onChangeItem(event: Event) {
		const node = document.querySelector(`input[name = "${this.id}"]:checked`);
		this.currentValue = this.items.find(
			(item: SelectorEntry) => `${this.id}_${item.id}` === node.id
		);
		this.emit('update', {
			type: 'selector',
			value: this.currentValue
		});
	}

	public focus(): void {
		const node: HTMLElement =
			document.querySelector(`input[name = "${this.id}"]:checked`) ||
			this.entries[0];

		node.focus();
	}
}

export interface SelectorEntry {
	id: string;
	title: string;
}
