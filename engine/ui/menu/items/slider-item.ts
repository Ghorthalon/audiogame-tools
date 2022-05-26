import { BaseItem } from './base-item';

export class SliderItem extends BaseItem {
	private slider: HTMLInputElement;
	private label: HTMLLabelElement;
	private currentValue: number;

	constructor(
		id: string,
		title: string,
		private min: number,
		private max: number,
		private step: number,
		private defaultValue: number = null
	) {
		super(id, title);
	}

	public getDOMNode(): HTMLElement {
		this.container = document.createElement('div');
		this.label = document.createElement('label');
		this.label.textContent = this.title;
		this.label.setAttribute('for', `slider_${this.id}`);
		this.slider = document.createElement('input');
		this.slider.id = `slider_${this.id}`;
		this.slider.type = 'range';
		this.slider.setAttribute('min', this.min.toString());
		this.slider.setAttribute('max', this.max.toString());
		this.slider.setAttribute('step', this.step.toString());
		if (this.defaultValue) this.slider.value = this.defaultValue.toString();
		this.slider.addEventListener('change', this.onChange.bind(this));
		this.slider.addEventListener('focus', this.onFocus.bind(this));
		this.container.appendChild(this.label);
		this.container.appendChild(this.slider);
		this.container.addEventListener('focus', this.onFocus.bind(this));
		return this.container;
	}

	public getContents(): string {
		return this.slider.value;
	}

	private onChange(event: Event) {
		this.emit('update', {
			type: 'slider',
			value: this.slider.value
		});
	}

	public focus(): void {
		this.slider && this.slider.focus();
	}
}
