import type { AzureOpenAIInput, OpenAIChatInput } from "langchain/chat_models/openai";
import type { BaseLanguageModelParams } from "langchain/dist/base_language";
import type { LegacyOpenAIInput } from "langchain/dist/types/openai-types";
import type { ClientOptions } from "openai";
import { default_openai_fields } from "../OpenAI/default_openai_fields";

const config = { ...default_openai_fields };
delete config.openAIApiKey;
delete config.configuration;
config.azureOpenAIApiKey = "";
config.azureOpenAIApiVersion = "";
config.azureOpenAIApiInstanceName = "";
config.azureOpenAIApiDeploymentName = "";


// https://platform.openai.com/docs/api-reference/chat/create
export const default_azure_fields: Partial<OpenAIChatInput> & Partial<AzureOpenAIInput> & BaseLanguageModelParams & {
    configuration?: ClientOptions & LegacyOpenAIInput;
    overrideRequestHeaders: any,
    overrideRequestBody: any,
} = config;