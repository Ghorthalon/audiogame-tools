export interface BaseLoader {
	get(path: string): Promise<ArrayBuffer>;
}
