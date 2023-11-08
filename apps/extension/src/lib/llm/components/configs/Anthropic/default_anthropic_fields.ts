import type { AnthropicInput } from "langchain/chat_models/anthropic";
import type { BaseChatModelParams } from "langchain/chat_models/base";

export const default_anthropic_fields: Partial<AnthropicInput> & BaseChatModelParams & {
    // clientOptions?: ClientOptions;
    overrideRequestHeaders: any,
    overrideRequestBody: any,
} = {
    /** Anthropic API key */
    anthropicApiKey: "",

    /**  Amount of randomness injected into the response. Ranges
       * from 0 to 1. Use temp closer to 0 for analytical /
       * multiple choice, and temp closer to 1 for creative
       * and generative tasks.
       */
    temperature: 1,

    /** Only sample from the top K options for each subsequent
     *  token. Used to remove "long tail" low probability
     *  responses. Defaults to -1, which disables it.
     */
    topK: -1,

    /**     Does nucleus sampling, in which we compute the
         * cumulative distribution over all the options for each
         * subsequent token in decreasing probability order and
         * cut it off once it reaches a particular probability
         * specified by top_p. Defaults to -1, which disables it.
         * Note that you should either alter temperature or top_p,
         * but not both.
         */
    topP: -1,

    /** A maximum number of tokens to generate before stopping. */
    maxTokensToSample: 2048,

    /** A list of strings upon which to stop generating.
     * You probably want `["\n\nHuman:"]`, as that's the cue for
     * the next turn in the dialog agent.
     */
    stopSequences: [],

    /** Whether to stream the results or not */
    streaming: false,

    /** Anthropic API URL */
    anthropicApiUrl: "https://api.anthropic.com",

    /** Model name to use */
    modelName: "claude-2",

    /** Overridable Anthropic ClientOptions */
    overrideRequestHeaders: {},
    overrideRequestBody: {},

    /** Holds any additional parameters that are valid to pass to {@link
     * https://console.anthropic.com/docs/api/reference |
     * `anthropic.complete`} that are not explicitly specified on this class.
     */
    invocationKwargs: {},
};