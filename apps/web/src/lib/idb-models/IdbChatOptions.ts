import { appStateStore } from '$lib/stores/appStateStore';
import { openDB, type DBSchema } from 'idb';

const DB_NAME = 'IDB_CHAT_OPTIONS_DB';
const TABLE_NAME = 'IDB_CHAT_OPTIONS_TABLE';

interface ChatDB extends DBSchema {
    [TABLE_NAME]: {
        key: string;
        value: IdbChatOptions;
    };
}

const dbPromise = openDB<ChatDB>(DB_NAME, 1, {
    upgrade(db) {
        db.createObjectStore(TABLE_NAME, { keyPath: 'chatId' });
    },
});

export class IdbChatOptions {

    chatId: string;
    llmConfigId: string;

    constructor(
        chatId: string,
        llmConfigId: string
    ) {
        this.chatId = chatId;
        this.llmConfigId = llmConfigId;
    }

    static async withLoad(chatId: string) {
        const idbChatOptions = new IdbChatOptions(chatId, appStateStore.defaultLLMConfigId);
        await idbChatOptions.load();
        return idbChatOptions;
    }

    async load() {
        const db = await dbPromise;
        const storedValue = await db.get(TABLE_NAME, this.chatId);
        if (storedValue) {
            Object.assign(this, storedValue);
        } else {
            this.llmConfigId = appStateStore.defaultLLMConfigId;
            await this.save();
        }
    }

    async save(): Promise<string> {
        const db = await dbPromise;
        return await db.put(TABLE_NAME, this);
    }

    static async delete(chatId: string): Promise<void> {
        const db = await dbPromise;
        await db.delete(TABLE_NAME, chatId);
    }
}