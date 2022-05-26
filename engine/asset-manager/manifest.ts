import * as yaml from 'yaml';

export async function Manifest(manifestPath: string): Promise<any> {
	try {
		const response = await fetch(manifestPath);
		console.log(response);
		const data = await response.text();
		console.log(`Parsing: `, data);
		const manifest = yaml.parse(data);
		return manifest;
	} catch (error) {
		alert(`Error occured: ${error.toString()}`);
	}
}

export function CheckManifest(manifest: any): boolean {
	const prevManifestStr = localStorage.getItem('manifest');
	if (!prevManifestStr) {
		localStorage.setItem('manifest', JSON.stringify(manifest));
		return false;
	}
	const prevManifest = JSON.parse(prevManifestStr);
	if (prevManifest.version === manifest.version) {
		return true;
	} else {
		localStorage.setItem('manifest', manifest);
		return false;
	}
}
