import { EventBus } from '../../event-bus';
import { SoundSet } from '../menu/interfaces/sound-set';
import { Line } from './line';
import { SoundManager } from './sound-manager';
import { KeyboardManager } from './keyboard-manager';

export class ScrollingText extends EventBus {
	private currentLineIndex: number;
	private currentLine: Line;
	private lines: Line[] = [];
	private wrapper: HTMLElement;
	private container: HTMLElement;
	private soundManager: SoundManager;
	private keyboardManager: KeyboardManager;
	public constructor(
		private text: string = null,
		private delimiter: string = '\n',
		private soundSet: SoundSet = null,
		private appearingCharacters: boolean = false,
		private characterAppearSpeed: number = 0
	) {
		super();
		this.soundManager = new SoundManager(this, this.soundSet);
		this.keyboardManager = new KeyboardManager(this);
		this.init();
	}

	public setText(text: string): this {
		this.text = text;
		this.init();
		return this;
	}

	public setSoundSet(soundSet: SoundSet): this {
		this.soundSet = soundSet;
		this.init();
		this.soundManager.setSoundSet(this.soundSet);
		return this;
	}

	public setDelimiter(delimiter: string): this {
		this.delimiter = delimiter;
		this.init();
		return this;
	}

	public setAppearingCharacters(appearing: boolean): this {
		this.appearingCharacters = appearing;
		this.init();
		return this;
	}

	public setAppearingCharacterSpeed(speed: number): this {
		this.characterAppearSpeed = speed;
		this.init();
		return this;
	}

	init(): void {
		const split = this.text.split(this.delimiter);
		this.lines = split.map((line) => new Line(line));
	}

	async run(element: HTMLElement): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			this.wrapper = document.createElement('div');
			this.wrapper.setAttribute('aria-role', 'polite');
			this.container = document.createElement('div');
			this.wrapper.appendChild(this.container);
			element.appendChild(this.wrapper);
			this.soundManager.init();
			this.keyboardManager.init();
			this.emit('open');
			let index = 0;
			this.currentLineIndex = 0;
			while (index < this.lines.length) {
				this.currentLineIndex = index;
				await this.displayLine(index);
				index++;
			}
			this.emit('close');
			this.keyboardManager.release();
			this.container.remove();
			resolve();
		});
	}

	async displayLine(index: number): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.container.innerHTML = '';
			this.container.appendChild(this.lines[index].getDOMNode());
			this.lines[index].display(
				this.container,
				this.appearingCharacters,
				this.characterAppearSpeed
			);
			this.lines[index].subscribe('character.appear', (event) =>
				this.emit('character.appear', event)
			);
			this.lines[index].subscribe('advance', () => {
				this.emit('advance');
				resolve();
			});
		});
	}

	public getContainer(): HTMLElement {
		return this.wrapper;
	}

	public getCurrentLine(): Line {
		return this.lines[this.currentLineIndex];
	}
}
