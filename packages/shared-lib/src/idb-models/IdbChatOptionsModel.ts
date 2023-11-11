import { chatSettingsStore } from '$root/stores/chatSettingsStore';
import { openDB, type DBSchema } from 'idb';

const DB_NAME = 'IDB_CHAT_OPTIONS_DB';
const TABLE_NAME = 'IDB_CHAT_OPTIONS_TABLE';

interface ChatDB extends DBSchema {
    [TABLE_NAME]: {
        key: string;
        value: IdbChatOptionsModel;
    };
}

const dbPromise = openDB<ChatDB>(DB_NAME, 1, {
    upgrade(db) {
        db.createObjectStore(TABLE_NAME, { keyPath: 'chatId' });
    },
});

export class IdbChatOptionsModel {

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
        const idbChatOptionsModel = new IdbChatOptionsModel(chatId, chatSettingsStore.defaultLLMConfigId);
        await idbChatOptionsModel.load();
        return idbChatOptionsModel;
    }

    async load() {
        const db = await dbPromise;
        const storedValue = await db.get(TABLE_NAME, this.chatId);
        if (storedValue) {
            Object.assign(this, storedValue);
        } else {
            this.llmConfigId = chatSettingsStore.defaultLLMConfigId;
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