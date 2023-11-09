import { StoreClass } from 'utils-vite-svelte/lib/storeHelpers/StoreClass';
import { LLMTypeEnum } from "shared-types/LLMTypeEnum";
import { IdbLLMConfig, NEW_LLM_CONFIG_ID } from "$lib/idb-models/IdbLLMConfig";

export type ChatModelListType = {
    llmConfigId: string;
    name: string;
    type: LLMTypeEnum,
    model: string;
}


export class LLMConfigList
    extends StoreClass<LLMConfigList> // to make it observable like svelte store
{
    list: ChatModelListType[] = [];
}

let isListReady = false;
export const load = async () => {
    const all = await IdbLLMConfig.getAll();
    const listData = all.map(function (model) {
        return {
            llmConfigId: model.llmConfigId,
            name: model.name,
            type: model.type,
            model: model.config.modelName || model.config.model || "",
        };
    }).filter((model) => model.llmConfigId !== NEW_LLM_CONFIG_ID);
    llmConfigList.list = listData;
    llmConfigList.reRenderer();
    isListReady = true;
}
export const waitUntil_llmConfigListReady = async () => {
    while (!isListReady) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

export const upsertChatModel = (name: string, llmConfigId: string, type: LLMTypeEnum, model: string) => {
    const index = llmConfigList.list.findIndex((model) => model.llmConfigId === llmConfigId);
    if (index !== -1) {
        llmConfigList.list[index] = { llmConfigId: llmConfigId, name, type, model };
    } else {
        llmConfigList.list = [...llmConfigList.list, { llmConfigId: llmConfigId, name, type, model }];
    }
    llmConfigList.reRenderer();
}

export const deleteModelFromList = (llmConfigId: string) => {
    llmConfigList.list = llmConfigList.list.filter((model) => model.llmConfigId !== llmConfigId);
    llmConfigList.reRenderer();
}

export const llmConfigList = new LLMConfigList();
Promise.resolve().then(async () => await load());