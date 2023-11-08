export function debounce(func: (...args: unknown[]) => void, delay: number) {
    let debounceTimer: NodeJS.Timeout;
    return (...args: unknown[]) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func(...args), delay);
    }
}