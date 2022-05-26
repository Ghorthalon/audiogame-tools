import { ScrollingText } from '.';

export class KeyboardManager {
	public constructor(private scrollingText: ScrollingText) {}

	public init(): void {
		this.scrollingText
			.getContainer()
			.addEventListener('keydown', (event) => this.handler(event));
	}

	public release(): void {
		this.scrollingText
			.getContainer()
			.removeEventListener('keydown', (event) => this.handler(event));
	}

	private handler(event: KeyboardEvent): void {
		switch (event.key) {
			case 'Enter':
				event.preventDefault();
				this.scrollingText.getCurrentLine().getAdvanceButton().click();
				break;
			default:
				break;
		}
	}
}
