import { StoreClass } from '$root/utils/store-helpers/StoreClass';
import { LLMTypeEnum } from "$root/types/LLMTypeEnum";
import { IdbLLMConfigModel } from "$root/idb-models/IdbLLMConfigModel";

export type ChatModelListType = {
    llmConfigId: string;
    name: string;
    type: LLMTypeEnum,
    model: string;
}

export class LLMConfigListStore
    extends StoreClass<LLMConfigListStore> // to make it observable like svelte store
{
    list: ChatModelListType[] = [];
}

let isListReady = false;
export const load = async () => {
    const all = await IdbLLMConfigModel.getAll();
    const listData = all.map(function (model) {
        return {
            llmConfigId: model.llmConfigId,
            name: model.name,
            type: model.type,
            model: model.config.modelName || model.config.model || "",
        };
    })
    // .filter((model) => model.llmConfigId !== NEW_IDB_KEY); // not needed anymore
    llmConfigListStore.list = listData;
    llmConfigListStore.reRenderer();
    isListReady = true;
}
export const waitUntil_llmConfigListReady = async () => {
    while (!isListReady) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

export const upsertChatModel = (name: string, llmConfigId: string, type: LLMTypeEnum, model: string) => {
    const index = llmConfigListStore.list.findIndex((model) => model.llmConfigId === llmConfigId);
    if (index !== -1) {
        llmConfigListStore.list[index] = { llmConfigId: llmConfigId, name, type, model };
    } else {
        llmConfigListStore.list = [...llmConfigListStore.list, { llmConfigId: llmConfigId, name, type, model }];
    }
    llmConfigListStore.reRenderer();
}

export const deleteModelFromList = (llmConfigId: string) => {
    llmConfigListStore.list = llmConfigListStore.list.filter((model) => model.llmConfigId !== llmConfigId);
    llmConfigListStore.reRenderer();
}

export const llmConfigListStore = new LLMConfigListStore();
Promise.resolve().then(async () => await load());