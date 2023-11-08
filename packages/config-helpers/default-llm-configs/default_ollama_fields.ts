// https://webml-demo.vercel.app/
// ollama run llama2
// OLLAMA_ORIGINS=https://www.webwebchat.com OLLAMA_HOST=127.0.0.1:11435 ollama serve
// OLLAMA_ORIGINS=http://localhost:4000 OLLAMA_HOST=127.0.0.1:11434 ollama serve
// model = "llama2";
// baseUrl = "http://localhost:11434";

import { ChatOllama } from 'langchain/chat_models/ollama';
type OllamaFields = ConstructorParameters<typeof ChatOllama>[0];

export const default_ollama_fields: OllamaFields = {
    model: "llama2",
    baseUrl: "http://localhost:11434",
    embeddingOnly: undefined,
    f16KV: undefined,
    frequencyPenalty: undefined,
    logitsAll: undefined,
    lowVram: undefined,
    mainGpu: undefined,
    mirostat: undefined,
    mirostatEta: undefined,
    mirostatTau: undefined,
    numBatch: undefined,
    numCtx: undefined,
    numGpu: undefined,
    numGqa: undefined,
    numKeep: undefined,
    numThread: undefined,
    penalizeNewline: undefined,
    presencePenalty: undefined,
    repeatLastN: undefined,
    repeatPenalty: undefined,
    ropeFrequencyBase: undefined,
    ropeFrequencyScale: undefined,
    temperature: undefined,
    tfsZ: undefined,
    stop: undefined,
    topK: undefined,
    topP: undefined,
    typicalP: undefined,
    useMLock: undefined,
    useMMap: undefined,
    vocabOnly: undefined
}