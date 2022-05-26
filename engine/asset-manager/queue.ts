export class Queue {
	private items: string[] = [];
	public constructor() {}

	public add(file: string): string[] {
		this.items.push(file);
		return this.items;
	}

	public remove(file: string): string[] {
		this.items = this.items.filter((item) => item !== file);
		return this.items;
	}

	public pop(): string {
		return this.items.pop();
	}

	public length(): number {
		return this.items.length;
	}
}
