import type { ChatOpenAI } from 'langchain/chat_models/openai';
import { default_openai_fields } from './default_openai_fields';

type ChatOpenAIFields = ConstructorParameters<typeof ChatOpenAI>[0];

const config = { ...default_openai_fields };
delete config.openAIApiKey;
delete config.configuration;
config.azureOpenAIApiKey = '';
config.azureOpenAIApiVersion = '';
config.azureOpenAIApiInstanceName = '';
config.azureOpenAIApiDeploymentName = '';

// https://platform.openai.com/docs/api-reference/chat/create
export const default_azure_fields: ChatOpenAIFields & {
	overrideRequestHeaders: any;
	overrideRequestBody: any;
} = config;
