import { openDB, type DBSchema } from 'idb';
import { BaseMessage, BaseListChatMessageHistory, type StoredMessage } from "langchain/schema";
import {
    mapChatMessagesToStoredMessages,
    mapStoredMessagesToChatMessages,
} from "./serializeMessageUtils";

const DB_NAME = 'IDB_CHAT_MESSAGE_HISTORY_DB';
const CHAT_TABLE_NAME = 'IDB_CHAT_MESSAGE_HISTORY_TABLE';

interface ChatDB extends DBSchema {
    [CHAT_TABLE_NAME]: {
        key: string;
        value: {
            chatId: string;
            messages: StoredMessage[];
        };
    };
}

const dbPromise = openDB<ChatDB>(DB_NAME, 1, {
    upgrade(db) {
        db.createObjectStore(CHAT_TABLE_NAME, { keyPath: 'chatId' });
    },
});

export class IdbChatMessageHistory extends BaseListChatMessageHistory {
    lc_namespace = ["langchain", "stores", "message", "idb"];

    private chatId: string;
    messages: BaseMessage[] = [];

    constructor(chatId: string) {
        super();
        this.chatId = chatId;
    }

    static async withLoad(chatId: string) {
        const history = new IdbChatMessageHistory(chatId);
        await history.load();
        return history;
    }

    convertToLowerCaseSearchIndex(): string {
        return this.messages.map((message) => message.content.toLowerCase()).join(" ");
    }

    async load() {
        const db = await dbPromise;
        const storedValue = await db.get(CHAT_TABLE_NAME, this.chatId);
        this.messages = mapStoredMessagesToChatMessages(storedValue?.messages || []);
        return db
    }

    async getMessages(): Promise<BaseMessage[]> {
        return this.messages;
    }

    async addMessage(message: BaseMessage): Promise<void> {
        this.messages.push(message);
        await this.save();
    }

    async updateMessage(content: string, index: number): Promise<void> {
        this.messages[index].content = content;
        await this.save();
    }

    private async save(): Promise<string> {
        const db = await dbPromise;
        return await db.put(CHAT_TABLE_NAME, {
            chatId: this.chatId,
            messages: mapChatMessagesToStoredMessages(this.messages),
        });
    }

    async clear(): Promise<void> {
        this.messages = [];
        await this.save();
    }

    static async delete(chatId: string): Promise<void> {
        const db = await dbPromise;
        await db.delete(CHAT_TABLE_NAME, chatId);
    }
}



