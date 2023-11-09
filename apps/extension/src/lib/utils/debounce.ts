export function debounce(func: (...args: unknown[]) => void, delay: number) {
    let debounceTimer: ReturnType<typeof setTimeout>;
    return (...args: unknown[]) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func(...args), delay);
    }
}