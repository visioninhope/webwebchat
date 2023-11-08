import { ChatOpenAI } from "langchain/chat_models/openai";
import type { Callbacks } from "langchain/callbacks";
import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { ChatOllama } from "langchain/chat_models/ollama";
import { appStateStore } from "$lib/stores/appStateStore";
import type { default_openai_fields } from "./components/configs/OpenAI/default_openai_fields";
import type { default_ollama_fields } from "./components/configs/Ollama/default_ollama_fields";
import type { default_azure_fields } from "./components/configs/Azure/default_azure_fields";
import type { default_anthropic_fields } from "./components/configs/Anthropic/default_anthropic_fields";
import type { BaseLanguageModel } from "langchain/base_language";
import { LLMIntegrationTypeName, type IdbLLMConfig } from "../idb-models/IdbLLMConfig";

export const testLLM = async (idbLLMConfig: IdbLLMConfig) => {
    try {
        const llm = getLLM(idbLLMConfig);
        const options: any = {
            maxConcurrency: 1,
            maxRetries: 1,
            verbose: true,
        };
        if (idbLLMConfig.type === LLMIntegrationTypeName.ChatAnthropic) {
            options.timeout = 20e3;
        }
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

export const getLLM = (idbLLMConfig: IdbLLMConfig, callbacks?: Callbacks): BaseLanguageModel => {
    if (
        idbLLMConfig.type === LLMIntegrationTypeName.ChatOpenAI
    ) {
        const configObj: typeof default_openai_fields = idbLLMConfig.config;
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
            openAIApiKey: appStateStore.openAIApiKey,
            ...configObj,
            callbacks,
        });
    } else if (
        idbLLMConfig.type === LLMIntegrationTypeName.ChatOllama
    ) {
        const configObj: typeof default_ollama_fields = idbLLMConfig.config;
        return new ChatOllama({
            ...configObj,
            callbacks,
        });
    } else if (
        idbLLMConfig.type === LLMIntegrationTypeName.ChatAnthropic
    ) {
        const configObj: typeof default_anthropic_fields = idbLLMConfig.config;
        if (
            Object.keys(configObj.overrideRequestBody).length > 0 ||
            Object.keys(configObj.overrideRequestHeaders).length > 0
        ) {
            if (!configObj.clientOptions) {
                configObj.clientOptions = {};
            }
            configObj.clientOptions.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
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

        if (configObj.anthropicApiKey?.trim() === "") {
            delete configObj.anthropicApiKey;
        }
        return new ChatAnthropic({
            anthropicApiKey: appStateStore.anthropicApiKey,
            ...configObj,
            callbacks
        });
    } else if (
        idbLLMConfig.type === LLMIntegrationTypeName.ChatOpenAIAzure
    ) {
        const configObj: typeof default_azure_fields = idbLLMConfig.config;
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
            azureOpenAIApiKey: appStateStore.azureOpenAIApiKey,
            azureOpenAIApiVersion: appStateStore.azureOpenAIApiVersion,
            azureOpenAIApiInstanceName: appStateStore.azureOpenAIApiInstanceName,
            azureOpenAIApiDeploymentName: appStateStore.azureOpenAIApiDeploymentName,
            ...configObj,
            callbacks
        });
    }
    throw new Error(`Unsupported chat model type: ${idbLLMConfig.type}`);
}