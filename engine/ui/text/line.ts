import { EventBus } from "../../event-bus";

export class Line extends EventBus {
	private container: HTMLElement;
	private textField: HTMLElement;
	private advanceButton: HTMLElement;
	private active: boolean = false;
	public constructor(private text: string) {
		super();
	}

	public getDOMNode(): HTMLElement {
		this.container = document.createElement('div');
		this.container.setAttribute('aria-role', 'polite');
		this.textField = document.createElement('div');
		this.container.appendChild(this.textField);
		this.advanceButton = document.createElement('button');
		this.advanceButton.textContent = 'Advance';
		this.advanceButton.addEventListener('click', (event) => {
			this.emit('advance');
			this.active = false;
		});
		this.container.appendChild(this.advanceButton);
		return this.container;
	}

	public display(
		element: HTMLElement,
		appearingCharacters: boolean = false,
		appearingCharacterSpeed: number = 0
	): void {
		this.active = true;
		this.textField.focus();
		if (!appearingCharacters) {
			this.textField.textContent = this.text;
		} else {
			this.fillText(0, appearingCharacterSpeed);
		}
	}

	private fillText(index: number, speed: number): void {
		if (!this.active) return;
		if (index > this.text.length) {
			return;
		}
		this.textField.textContent += this.text.charAt(index);
		this.emit('character.appear', this.textField.textContent);
		setTimeout(() => this.fillText((index += 1), speed), speed);
	}

	public getAdvanceButton(): HTMLElement {
		return this.advanceButton;
	}
}
