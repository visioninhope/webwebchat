export function safeStringify(obj: any): string {
    const cache = new Set();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
                // Duplicate reference found, discard key
                return;
            }
            // Store value in our set
            cache.add(value);
        }
        return value;
    });
}