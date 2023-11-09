import { generateRandomId } from "utils-vite-svelte/lib/generateRandomId";
import { openDB, type DBSchema } from 'idb';
import { deleteModelFromList, upsertChatModel } from "$lib/stores/LLMConfigList";
import { default_openai_fields } from "config-helpers/default-llm-configs/default_openai_fields";
import { safeStringify } from "utils-vite-svelte/lib/safeStringify";
import { defaultSystemMessage } from "$lib/constants/constants";
import { LLMTypeEnum } from "shared-types/LLMTypeEnum";


const DB_NAME = 'LLM_CONFIG_MODEL_DB';
const TABLE_NAME = 'LLM_CONFIG_MODEL_TABLE';
export const NEW_LLM_CONFIG_ID = "new";

let dbPromise = openDB<ModelSchema>(DB_NAME, 1, {
    upgrade(db) {
        db.createObjectStore(TABLE_NAME, { keyPath: 'llmConfigId' });
    },
});


interface ModelSchema extends DBSchema {
    [TABLE_NAME]: {
        key: string;
        value: IdbLLMConfig;
    };
}

export class IdbLLMConfig {
    llmConfigId: string = NEW_LLM_CONFIG_ID;
    name: string = "";
    type: LLMTypeEnum = LLMTypeEnum.ChatOpenAI;
    config: any = default_openai_fields;
    systemMessage: string = defaultSystemMessage;


    getModelName() {
        return this.config.modelName || this.config.model || "";
    }

    static async withLoad(llmConfigId: string) {
        const model = new IdbLLMConfig();
        model.llmConfigId = llmConfigId;
        await model.load();
        return model;
    }

    private async load() {
        try {
            const storedValue = await this.loadState();
            if (storedValue) {
                Object.assign(this, storedValue);
            }
        } catch (error) {
            throw new Error(`Failed to load state: ${error}`);
        }
    }

    async save() {
        let isNew = this.llmConfigId === NEW_LLM_CONFIG_ID;
        if (isNew) {
            this.llmConfigId = `llm-conf-${generateRandomId()}`;
        }
        await this.saveSerialized();
        const modelName = this.config.modelName || this.config.model || "";
        upsertChatModel(this.name, this.llmConfigId, this.type, modelName);
        return this.llmConfigId;
    }

    private async saveSerialized() {
        try {
            const db = await dbPromise;
            return await db.put(TABLE_NAME, this.serialize());
        } catch (error) {
            throw new Error(`Failed to save TABLE_NAME:'${TABLE_NAME}' ERROR:'${error}'`);
        }
    }

    private async loadState() {
        try {
            const db = await dbPromise;
            return await db.get(TABLE_NAME, this.llmConfigId);
        } catch (error) {
            throw new Error(`Failed to get stored value: ${error}`);
        }
    }

    private serialize() {
        return JSON.parse(safeStringify(this));
    }

    static async getAll() {
        const db = await dbPromise;
        return await db.getAll(TABLE_NAME);
    }

    static async delete(llmConfigId: string) {
        try {
            const db = await dbPromise;
            deleteModelFromList(llmConfigId);
            return await db.delete(TABLE_NAME, llmConfigId);
        } catch (error) {
            throw new Error(`Failed to delete model: ${error}`);
        }
    }
}

