import type { ChatOpenAI } from 'langchain/chat_models/openai';

type ChatOpenAIFields = ConstructorParameters<typeof ChatOpenAI>[0];
// https://platform.openai.com/docs/api-reference/chat/create
export const default_openai_fields: ChatOpenAIFields & {
	overrideRequestHeaders: any;
	overrideRequestBody: any;
} = {
    openAIApiKey: "",
    // enum | string for fine-tuning like : 'ft:gpt-3.5-turbo-0613:{ORG_NAME}::{MODEL_ID}'
    // | 'gpt-4'
    // | 'gpt-4-0314'
    // | 'gpt-4-0613'
    // | 'gpt-4-32k'
    // | 'gpt-4-32k-0314'
    // | 'gpt-4-32k-0613'
    // | 'gpt-3.5-turbo'
    // | 'gpt-3.5-turbo-16k'
    // | 'gpt-3.5-turbo-0301'
    // | 'gpt-3.5-turbo-0613'
    // | 'gpt-3.5-turbo-16k-0613';
    /*✅*/modelName: "gpt-3.5-turbo",
    /*✅*/frequencyPenalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. //https://platform.openai.com/docs/guides/gpt/managing-tokens
    /*✅*/presencePenalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. // https://platform.openai.com/docs/guides/gpt/parameter-details
    /*✅*/streaming: true,
    /*✅*/temperature: 1, // What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or top_p but not both.
    /*✅*/topP: 1, // An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.
    configuration: {
        baseURL: "https://api.openai.com/v1",
    },
    overrideRequestHeaders: {},
    overrideRequestBody: {},
};
// override default fetch sample
// default_fields.configuration!.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
//     let options = { ...init };
//     if (Object.keys(default_fields.overrideRequestHeaders).length > 0) {
//         options.headers = {
//             ...options?.headers,
//             ...default_fields.overrideRequestHeaders,
//         };
//     }
//     if (Object.keys(default_fields.overrideRequestBody).length > 0) {
//         options.body = JSON.stringify({
//             ...JSON.parse(options.body as string),
//             ...default_fields.overrideRequestBody,
//         });
//     }
//     return fetch(input, options);
// }
// declare const window: any;
// export const globalChatOpenAI = new ChatOpenAI(default_fields);
// await globalChatOpenAI.invoke('hello')
// window.globalChatOpenAI = globalChatOpenAI;
// window.default_fields = default_fields;
// console.log(window.globalChatOpenAI);