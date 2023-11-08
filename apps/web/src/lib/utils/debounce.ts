export function debounce(func: (...args: unknown[]) => void, delay: number) {
    let debounceTimer: number;
    return (...args: unknown[]) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func(...args), delay);
    }
}