import { writable } from 'svelte/store';

type ToastItem = {
    class?: string;
    message: string;
};

// create a custom svelte store for an array of ToastItem
const customToastStore = () => {
    const { subscribe, set, update } = writable<ToastItem[]>([]);

    const removeItemTimeout = (item: ToastItem, timeout: number) => {
        setTimeout(() => {
            update((items) => items.filter((i) => i !== item));
        }, timeout);
    };

    return {
        subscribe,
        set,
        update,
        // custom method to add an item to the array
        addItem: (item: ToastItem) => {
            update((items) => [item, ...items]);
            removeItemTimeout(item, 10e3);
        },
        // custom method to remove an item from the array
        removeItem: (item: ToastItem) => update((items) => items.filter((i) => i !== item)),
        // custom method to clear the array
        clear: () => set([]),
    };
};

export const toastStore = customToastStore();

