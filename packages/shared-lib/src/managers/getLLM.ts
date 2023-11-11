import { ChatOpenAI } from "langchain/chat_models/openai";
import type { Callbacks } from "langchain/callbacks";
import { ChatOllama } from "langchain/chat_models/ollama";
import { default_openai_fields } from "$root/constants/default-llm-configs/default_openai_fields";
import { default_azure_fields } from "$root/constants/default-llm-configs/default_azure_fields";
import { default_ollama_fields } from "$root/constants/default-llm-configs/default_ollama_fields";
import type { BaseLanguageModel } from "langchain/base_language";
import { type IdbLLMConfigModel } from "$root/idb-models/IdbLLMConfigModel";
import { LLMTypeEnum } from "$root/types/LLMTypeEnum";
import { openAiSettingsStore } from "$root/stores/openAiSettingsStore";
import { azureSettingsStore } from "$root/stores/azureSettingsStore";
import type { default_anthropic_fields } from "$root/constants/default-llm-configs/default_anthropic_fields";
import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { anthropicSettingsStore } from "$root/stores/anthropicSettingsStore";

export const testLLM = async (idbLLMConfigModel: IdbLLMConfigModel) => {
    try {
        const llm = getLLM(idbLLMConfigModel);
        const options: any = {
            maxConcurrency: 1,
            maxRetries: 1,
            verbose: true,
        };
        const result = await llm.invoke('hello', options);
        return {
            status: true,
            error: "",
        };
    } catch (error) {
        return {
            status: false,
            error: (error instanceof Error) ? error.message : error,
        };
    }
}

const handleOverrides = (configObj: any, requestInit?: RequestInit) => {
    let options = { ...requestInit };
    if (Object.keys(configObj.overrideRequestHeaders).length > 0) {
        options.headers = {
            ...options?.headers,
            ...configObj.overrideRequestHeaders,
        };
    }
    if (Object.keys(configObj.overrideRequestBody).length > 0) {
        options.body = JSON.stringify({
            ...JSON.parse(options.body as string),
            ...configObj.overrideRequestBody,
        });
    }
    return options;
}
export const getChatOpenAIAzure = (idbLLMConfigModel: IdbLLMConfigModel, callbacks?: Callbacks): ChatOpenAI => {
    const configObj: typeof default_azure_fields = idbLLMConfigModel.config;
    if (
        Object.keys(configObj.overrideRequestBody).length > 0 ||
        Object.keys(configObj.overrideRequestHeaders).length > 0
    ) {
        if (!configObj.configuration) {
            configObj.configuration = {};
        }
        configObj.configuration.fetch = function (requestInfo: RequestInfo | URL, requestInit?: RequestInit) {
            let options = handleOverrides(configObj, requestInit);
            return fetch(requestInfo, options);
        }
    }
    // use the global azure settings if the user has not specified one
    if (configObj.azureOpenAIApiKey?.trim() === "") {
        delete configObj.azureOpenAIApiKey;
    }
    if (configObj.azureOpenAIApiVersion?.trim() === "") {
        delete configObj.azureOpenAIApiVersion;
    }
    if (configObj.azureOpenAIApiInstanceName?.trim() === "") {
        delete configObj.azureOpenAIApiInstanceName;
    }
    if (configObj.azureOpenAIApiDeploymentName?.trim() === "") {
        delete configObj.azureOpenAIApiDeploymentName;
    }
    return new ChatOpenAI({
        azureOpenAIApiKey: azureSettingsStore.azureOpenAIApiKey,
        azureOpenAIApiVersion: azureSettingsStore.azureOpenAIApiVersion,
        azureOpenAIApiInstanceName: azureSettingsStore.azureOpenAIApiInstanceName,
        azureOpenAIApiDeploymentName: azureSettingsStore.azureOpenAIApiDeploymentName,
        ...configObj,
        callbacks
    });
}
export const getChatOpenAI = (idbLLMConfigModel: IdbLLMConfigModel, callbacks?: Callbacks): ChatOpenAI => {
    const configObj: typeof default_openai_fields = idbLLMConfigModel.config;
    if (
        Object.keys(configObj.overrideRequestBody).length > 0 ||
        Object.keys(configObj.overrideRequestHeaders).length > 0
    ) {
        if (!configObj.configuration) {
            configObj.configuration = {};
        }
        configObj.configuration.fetch = function (requestInfo: RequestInfo | URL, requestInit?: RequestInit) {
            let options = handleOverrides(configObj, requestInit);
            return fetch(requestInfo, options);
        }
    }
    // use the global api key if the user has not specified one
    if (configObj.openAIApiKey?.trim() === "") {
        delete configObj.openAIApiKey;
    }
    return new ChatOpenAI({
        openAIApiKey: openAiSettingsStore.openAIApiKey,
        ...configObj,
        callbacks,
    });
}
export const getChatOllama = (idbLLMConfigModel: IdbLLMConfigModel, callbacks?: Callbacks): ChatOllama => {
    const configObj: typeof default_ollama_fields = idbLLMConfigModel.config;
    return new ChatOllama({
        ...configObj,
        callbacks,
    });
}
export const getChatAnthropic = (idbLLMConfigModel: IdbLLMConfigModel, callbacks?: Callbacks): ChatAnthropic => {
    const configObj: typeof default_anthropic_fields = idbLLMConfigModel.config;
    if (
        Object.keys(configObj.overrideRequestBody).length > 0 ||
        Object.keys(configObj.overrideRequestHeaders).length > 0
    ) {
        if (!configObj.clientOptions) {
            configObj.clientOptions = {};
        }
        configObj.clientOptions.fetch = function (requestInfo: RequestInfo | URL, requestInit?: RequestInit) {
            let options = handleOverrides(configObj, requestInit);
            return fetch(requestInfo, options);
        };
    }

    if (configObj.anthropicApiKey?.trim() === '') {
        delete configObj.anthropicApiKey;
    }
    return new ChatAnthropic({
        anthropicApiKey: anthropicSettingsStore.anthropicApiKey,
        ...configObj,
        callbacks
    });
}

export const getLLMExtension = (idbLLMConfigModel: IdbLLMConfigModel, callbacks?: Callbacks): BaseLanguageModel => {
    switch (idbLLMConfigModel.type) {
        case LLMTypeEnum.ChatAnthropic:
            return getChatAnthropic(idbLLMConfigModel, callbacks);
        default:
            return getLLM(idbLLMConfigModel, callbacks);
    }
}

export const getLLM = (idbLLMConfigModel: IdbLLMConfigModel, callbacks?: Callbacks): BaseLanguageModel => {
    switch (idbLLMConfigModel.type) {
        case LLMTypeEnum.ChatOpenAI:
            return getChatOpenAI(idbLLMConfigModel, callbacks);
        case LLMTypeEnum.ChatOpenAIAzure:
            return getChatOpenAIAzure(idbLLMConfigModel, callbacks);
        case LLMTypeEnum.ChatOllama:
            return getChatOllama(idbLLMConfigModel, callbacks);
        default:
            throw new Error(`Unsupported chat model type: ${idbLLMConfigModel.type}`);
    }
}
