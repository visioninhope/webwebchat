import { LLMTypeEnum } from "$root/types/LLMTypeEnum";
import { default_anthropic_fields } from "./default_anthropic_fields";
import { default_azure_fields } from "./default_azure_fields";
import { default_ollama_fields } from "./default_ollama_fields";
import { default_openai_fields } from "./default_openai_fields";

export function getDefaultConfig(type: LLMTypeEnum) {
    switch (type) {
        case LLMTypeEnum.ChatOpenAI:
            return default_openai_fields;
        case LLMTypeEnum.ChatOpenAIAzure:
            return default_azure_fields;
        case LLMTypeEnum.ChatOllama:
            return default_ollama_fields;
        case LLMTypeEnum.ChatAnthropic:
            return default_anthropic_fields;
        default:
            throw new Error(`Unknown chat provider type: ${type}`);
    }
}