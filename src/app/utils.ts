export function parseDescription(raw: string) {
    return {
        image: raw.match(/<image\s+src="(.*?)"/)?.[1] || '',
        text: raw.split('>')[1]?.trim() || ''
    };
}