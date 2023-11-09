import type { Writable } from 'svelte/store';
import { safeStringify } from './safeStringify';

function safe_not_equal(a: any, b: any): boolean {
    return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

export class StoreClass<T>
    implements Writable<T>
{
    _subscribers: Set<(value: T) => void> = new Set();
    [key: string]: any;

    constructor() {
        Promise.resolve().then(() => this.reRenderer());
    }

    subscribe(run: (value: T) => void): () => void {
        this._subscribers.add(run);
        run(this as unknown as T);
        return () => {
            this._subscribers.delete(run);
        };
    }

    serialize(): { [key: string]: any } {
        const serialized: { [key: string]: any } = {};
        for (const [key, value] of Object.entries(this)) {
            if (typeof value !== 'function' && key !== '_subscribers') {
                serialized[key] = value;
            }
        }
        return JSON.parse(safeStringify(serialized));
    }

    set(value: T): void {
        if (safe_not_equal(this as unknown as T, value)) {
            Object.assign(this, value);
            this._notifySubscribers();
        }
    }

    update(fn: (value: T) => T): void {
        this.set(fn(this as unknown as T));
    }

    reRenderer(): void {
        this._makePropertiesObservable();
        this._notifySubscribers();
    }

    _notifySubscribers(): void {
        this._subscribers.forEach(subscriber => subscriber(this as unknown as T));
    }

    _makePropertiesObservable(obj = this): void {
        for (const key of Object.keys(obj)) {
            if (key === "_subscribers") {
                continue;
            }
            let _value = obj[key];
            if (_value && typeof _value === 'object') {
                this._makePropertiesObservable(_value);
            }

            const descriptor = Object.getOwnPropertyDescriptor(obj, key);
            if (descriptor && (descriptor.get || descriptor.set)) {
                continue;
            } else {
                Object.defineProperty(obj, key, {
                    get: () => _value,
                    set: (value) => {
                        if (safe_not_equal(_value, value)) {
                            _value = value;
                            // Disable auto make properties observable, use reRenderer for new array items and objects...
                            // if (typeof value === 'object') {
                            //     this._makePropertiesObservable();
                            // }
                            this._notifySubscribers();
                        }
                    }
                });
            }
        }
    }
}