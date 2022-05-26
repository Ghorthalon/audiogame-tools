import { Menu } from '.';

export class KeyboardManager {
	public constructor(private menu: Menu) {}

	public init(): void {
		this.menu
			.getContainer()
			.addEventListener('keydown', this.handler.bind(this));
		// This trick let's us detect the press of the back or forward buttons to exit out of the menu.
		window.onpopstate = () => this.menu.clickCancelAction();
	}

	private handler(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				this.menu.focusNext();
				break;
			case 'ArrowUp':
				event.preventDefault();
				this.menu.focusPrevious();
				break;
			case 'Enter':
				event.preventDefault();
				this.menu.clickDefaultAction();
				break;
			case 'Escape':
				event.preventDefault();
				this.menu.clickCancelAction();
				break;
			default:
				break;
		}
	}

	public release(): void {
		this.menu
			.getContainer()
			.removeEventListener('keydown', this.handler.bind(this));
		window.onpopstate = null;
	}
}
