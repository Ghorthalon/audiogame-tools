import { BaseOutput } from './base-output';

export class AriaOutput extends BaseOutput {
	private container: HTMLElement;
	private speechDisplay: HTMLElement;
	private timeout: number = 100;
	public constructor(options: any = {}) {
		super();
		this.timeout = options.timeout || 100;
		this.init();
	}

	private init(): void {
		this.container = document.createElement('div');
		this.container.setAttribute('aria-live', 'polite');
		this.speechDisplay = document.createElement('div');
		this.speechDisplay.setAttribute('aria-live', 'polite');
		this.container.append(this.speechDisplay);
		document.body.appendChild(this.container);
		document.body.insertBefore(this.container, document.body.firstChild);
	}

	public speak(text: string): void {
		this.clearDisplay();
		const node = document.createTextNode(text);
		const para = document.createElement('p');
		para.appendChild(node);
		this.speechDisplay.appendChild(para);
		setTimeout(this.clearDisplay.bind(this), this.timeout);
	}

	public stop(): void {
		this.clearDisplay();
	}

	public clearDisplay(): void {
		this.speechDisplay.innerHTML = '';
	}
}
