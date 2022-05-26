export class EventBus {
	private events: Map<string, EventItem>;

	public constructor() {
		this.events = new Map();
	}

	public emit(id: string, data: any = {}) {
		let ev = this.events.get(id);
		if (!ev) {
			let ev = new EventItem(id);
			this.events.set(id, ev);
			return;
		}
		ev.subscribers.forEach((subscriber) => {
			subscriber(data);
		});
	}

	public subscribe(id: string, subscriber: Function) {
		let ev = this.events.get(id);
		if (!ev) {
			ev = new EventItem(id);
			this.events.set(id, ev);
		}
		ev.subscribers.push(subscriber);
	}

	public unsubscribe(id: string, subscriber: Function) {
		if (this.events.has(id)) {
			let ev = this.events.get(id);
			ev.subscribers = ev.subscribers.filter((fn) => fn !== subscriber);
			if (ev.subscribers.length < 1) {
				this.events.delete(id);
			}
		}
	}

	public unsubscribeAll(id: string) {
		if (this.events.has(id)) {
			this.events.delete(id);
		}
	}
}

export class EventItem {
	public id: string;
	public subscribers: Function[];
	public constructor(id: string) {
		this.id = id;
		this.subscribers = [];
	}
}
