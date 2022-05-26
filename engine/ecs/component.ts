export class BaseComponent {
	public id: number;
	public properties: any;
	public constructor() {
		this.id = 0;
		this.properties = {};
	}

	clone(): BaseComponent {
		const comp = new BaseComponent();
		comp.properties = this.properties;
		return comp;
	}
}

export interface Component {
	id: number;
	properties: any;
	clone(): BaseComponent;
	new (): BaseComponent;
}
