import { get as getKeyVal, set as setKeyVal } from 'idb-keyval';
import { debounce } from '../debounce';
import { StoreClass } from "./StoreClass";


export class AutoSaveStoreClass<T> extends StoreClass<T> {
    // make sure to ignore in shouldSerialize StoreClass
    _unsubscribe?: () => void;
    _debouncedSave: () => void;
    _lastSerializedState: string = "";
    _key_idb_keyval: string;

    // override shouldSerialize
    shouldSerialize(key: string, value: unknown): boolean {
        return super.shouldSerialize(key, value) &&
            ![ // not serialize these keys
                '_unsubscribe',
                '_debouncedSave',
                '_lastSerializedState',
                '_key_idb_keyval'
            ].includes(key);
    }

    constructor(key: string) {
        super();
        this._key_idb_keyval = key;
        this._debouncedSave = debounce(() => {
            const serializedState = this.serialize();
            const serializedStateStr = JSON.stringify(serializedState);
            if (this._lastSerializedState !== serializedStateStr) {
                this._lastSerializedState = serializedStateStr;
                setKeyVal(this._key_idb_keyval, serializedState);
            }
        }, 500);
        this.loadState().then(() => {
            this._lastSerializedState = JSON.stringify(this.serialize());
            this._unsubscribe = this.subscribe(() => {
                this._debouncedSave();
            });
        });
    }

    async loadState() {
        try {
            const storedValue = await getKeyVal<T>(this._key_idb_keyval);
            if (storedValue) {
                Object.assign(this, storedValue);
            }
        } catch (error) {
            console.error(`Failed to load state: ${error}`);
        }
    }
}
