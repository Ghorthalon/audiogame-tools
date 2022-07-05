import { BaseItem } from './items/base-item';
import { SoundSet } from './interfaces/sound-set';
import { EventBus } from '../../event-bus';
import { SoundManager } from './sound-manager';
import { KeyboardManager } from './keyboard-manager';

export class Menu extends EventBus {
	private titleContainer: HTMLElement;
	private currentItem: BaseItem;
	private currentIndex: number = 0;
	private container: HTMLElement;
	private element: HTMLElement;
	private DOMNodes: HTMLElement[] = [];
	private soundManager: SoundManager;
	private keyboardManager: KeyboardManager;
	constructor(
		private title: string = 'Menu',
		private menuItems: BaseItem[] = [],
		private soundSet: SoundSet = null,
		private defaultAction: string = null,
		private cancelAction: string = null
	) {
		super();
		this.currentIndex = 0;
		this.currentItem = null;
		this.soundManager = new SoundManager(soundSet);
		this.keyboardManager = new KeyboardManager(this);
		this.init();
	}

	private init() {
		this.menuItems[this.currentIndex] &&
			this.menuItems[this.currentIndex].focus();
		this.emit('init');
	}

	public addItem(item: BaseItem): this {
		this.menuItems.push(item);
		this.emit('item.add', item);
		return this;
	}

	public setTitle(title: string): this {
		this.title = title;
		return this;
	}

	public setSoundSet(soundSet: SoundSet): this {
		this.soundSet = soundSet;
		this.soundManager.setSoundSet(this.soundSet);
		return this;
	}

	public setDefaultAction(id: string): this {
		this.defaultAction = id;
		return this;
	}

	public setCancelAction(id: string): this {
		this.cancelAction = id;
		return this;
	}

	async run(element: HTMLElement): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this.element = element;
			this.container = document.createElement('div');
			this.titleContainer = document.createElement('h1');
			this.titleContainer.textContent = this.title;
			this.container.appendChild(this.titleContainer);
			this.menuItems.forEach((item: BaseItem) => {
				this.appendToContainer(item.getDOMNode());
				item.subscribe('update', this.handleItemUpdate.bind(this));
				item.subscribe('focus', this.onItemFocus.bind(this));
				item.subscribe('choose', (event) => {
					const menuMap = this.compile();
					this.soundManager.handleSound('choose');
					this.emit('choose', menuMap);
					resolve(menuMap);
				});
			});
			element.appendChild(this.container);
			this.soundManager.handleSound('open');
			this.keyboardManager.init();
			// push some data onto the history stack so that we can use the browser's back button to exit out of the menu.
			history.pushState({ menu: true }, null, null);
		});
	}

	public close(): void {
		this.container.remove();
		this.soundManager.handleSound('close');
		this.keyboardManager.release();
		this.DOMNodes.forEach((item) => {
			this.container.removeChild(item);
		});
		this.emit('close');
	}

	private appendToContainer(node: HTMLElement) {
		this.container.appendChild(node);
		this.DOMNodes.push(node);
	}

	private handleItemUpdate(value: any) {
		this.soundManager.handleSound(value.type, value.value);
		this.emit('update', this.compile());
	}

	private onItemFocus(id: string) {
		this.soundManager.handleSound('focus');
		this.currentIndex = this.menuItems.indexOf(
			this.menuItems.find((item) => item.getID() == id)
		);
		this.emit('focus', this.menuItems[this.currentIndex]);
	}

	public focusNext(): void {
		if (this.currentIndex < this.menuItems.length - 1) {
			this.currentIndex++;
		}
		this.focusCurrentIndex();
	}

	public focusPrevious(): void {
		if (this.currentIndex > 0) {
			this.currentIndex--;
		}
		this.focusCurrentIndex();
	}

	private focusCurrentIndex(): void {
		this.menuItems[this.currentIndex].focus();
	}

	public getCurrentFocus(): BaseItem {
		return this.menuItems[this.currentIndex];
	}

	public getContainer(): HTMLElement {
		return this.container;
	}

	public clickDefaultAction(): void {
		if (!this.defaultAction) return;
		const item = this.menuItems.find(
			(item) => item.getID() === this.defaultAction
		);
		item.click();
	}

	public clickCancelAction(): void {
		if (!this.cancelAction) return;
		const node = this.menuItems.find(
			(item) => item.getID() === this.cancelAction
		);
		node.click();
	}

	private compile(): Map<string, any> {
		const menuMap = new Map<string, any>();
		this.menuItems.forEach((item) =>
			menuMap.set(item.getID(), item.getContents())
		);
		menuMap.set('selected', this.menuItems[this.currentIndex].getID());
		return menuMap;
	}
}

export * from './items';
