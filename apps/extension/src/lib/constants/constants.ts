export const defaultSystemMessage = "You are a helpful AI assistant.";
export const defaultEmbeddingModelName = "text-embedding-ada-002";
export const defaultModelName = "gpt-3.5-turbo";
export const default_question_generator_template_start = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

`;
export const default_question_generator_template_end = `
Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;