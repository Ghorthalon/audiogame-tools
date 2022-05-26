export function buildPath(basePath: string, path: string): string {
	if (!basePath) {
		return path;
	} else {
		return `${basePath}/${path}`;
	}
}
