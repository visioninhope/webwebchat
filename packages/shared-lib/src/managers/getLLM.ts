import { ChatOpenAI } from "langchain/chat_models/openai";
import type { Callbacks } from "langchain/callbacks";
import { ChatOllama } from "langchain/chat_models/ollama";
import { default_openai_fields } from "$root/constants//default-llm-configs/default_openai_fields";
import { default_azure_fields } from "$root/constants//default-llm-configs/default_azure_fields";
import { default_ollama_fields } from "$root/constants//default-llm-configs/default_ollama_fields";
import type { BaseLanguageModel } from "langchain/base_language";
import { type IdbLLMConfigModel } from "$root/idb-models/IdbLLMConfigModel";
import { LLMTypeEnum } from "$root/types/LLMTypeEnum";
import { openAiSettingsStore } from "$root/stores/openAiSettingsStore";
import { azureSettingsStore } from "$root/stores/azureSettingsStore";

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

export const getLLM = (idbLLMConfigModel: IdbLLMConfigModel, callbacks?: Callbacks): BaseLanguageModel => {
    if (
        idbLLMConfigModel.type === LLMTypeEnum.ChatOpenAI
    ) {
        const configObj: typeof default_openai_fields = idbLLMConfigModel.config;
        if (
            Object.keys(configObj.overrideRequestBody).length > 0 ||
            Object.keys(configObj.overrideRequestHeaders).length > 0
        ) {
            if (!configObj.configuration) {
                configObj.configuration = {};
            }
            configObj.configuration.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
                let options = { ...init };
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
                return fetch(input, options);
            }
        }

        if (configObj.openAIApiKey?.trim() === "") {
            delete configObj.openAIApiKey;
        }
        return new ChatOpenAI({
            openAIApiKey: openAiSettingsStore.openAIApiKey,
            ...configObj,
            callbacks,
        });
    } else if (
        idbLLMConfigModel.type === LLMTypeEnum.ChatOllama
    ) {
        const configObj: typeof default_ollama_fields = idbLLMConfigModel.config;
        return new ChatOllama({
            ...configObj,
            callbacks,
        });
    } else if (
        idbLLMConfigModel.type === LLMTypeEnum.ChatOpenAIAzure
    ) {
        const configObj: typeof default_azure_fields = idbLLMConfigModel.config;
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
    throw new Error(`Unsupported chat model type: ${idbLLMConfigModel.type}`);
}