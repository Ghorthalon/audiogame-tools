// An item in the data pool

export default class DataPoolItem {
	private name: string;
	private data: any;
	private decodedData: AudioBuffer;

	constructor(name: string, data: any = null, decodedData: any = null) {
		this.name = name;
		this.data = data;
		this.decodedData = decodedData;
	}

	getData(): any {
		return this.data;
	}
	setData(data: any): void {
		this.data = data;
	}
	getDecodedData(): any {
		return this.decodedData;
	}
	setDecodedData(data: any): void {
		this.decodedData = this.decodedData;
	}

	getName(): string {
		return this.name;
	}
	setName(name: string): void {
		this.name = name;
	}
}
