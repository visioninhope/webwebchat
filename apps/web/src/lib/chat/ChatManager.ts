import { IdbChatMessageHistory } from "$lib/idb-models/chatHistory/IdbChatMessageHistory";
import { updateTreeItem, type Item, getTreeItem, removeTreeChat } from "$lib/stores/chatListTreeviewStore";
import type { Callbacks } from "langchain/callbacks";
import { getLLM } from "$lib/llm/getLLM";
import { BufferMemory } from "langchain/memory";
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate } from "langchain/prompts";
import { ConversationChain } from "langchain/chains";
import { IdbChatOptions } from "$lib/idb-models/IdbChatOptions";
import { IdbLLMConfig } from "$lib/idb-models/IdbLLMConfig";
import { LLMTypeEnum } from "shared-lib/src/types/LLMTypeEnum";

export class ChatManager {

    chatId: string;
    chatHistory: IdbChatMessageHistory;
    chatOptions: IdbChatOptions;
    chatListTreeviewItem!: Item;
    llmConfig!: IdbLLMConfig;

    constructor(
        chatId: string,
        chatHistory: IdbChatMessageHistory,
        chatOptions: IdbChatOptions,
        chatListTreeviewItem: Item
    ) {
        this.chatId = chatId;
        this.chatHistory = chatHistory;
        this.chatOptions = chatOptions;
        this.chatListTreeviewItem = chatListTreeviewItem;
    }

    static async withLoad(chatId: string) {
        const [
            chatHistory,
            chatOptions
        ] = await Promise.all([
            IdbChatMessageHistory.withLoad(chatId),
            IdbChatOptions.withLoad(chatId)
        ]);
        const chatListTreeviewItem = getTreeItem(chatId);
        if (!chatListTreeviewItem) {
            throw new Error(`ChatListTreeviewItem not found for chatId: ${chatId}`);
        } else {
            const manager = new ChatManager(
                chatId,
                chatHistory,
                chatOptions,
                chatListTreeviewItem
            );
            await manager.reloadLLMConfig();
            return manager;
        }
    }

    async reloadLLMConfig() {
        this.llmConfig = await IdbLLMConfig.withLoad(this.chatOptions.llmConfigId);
    }

    async updateName(editedName: string) {
        updateTreeItem(this.chatId, { name: editedName });
        if (this.chatListTreeviewItem) {
            this.chatListTreeviewItem.name = editedName;
        }
    }

    static async delete(chatId: string) {
        await Promise.all([
            await IdbChatOptions.delete(chatId),
            await IdbChatMessageHistory.delete(chatId)
        ]);
        removeTreeChat(chatId);
    }

    async checkAndSetChatTitle() {
        if (
            this.chatListTreeviewItem.name.trim() === "" &&
            this.chatHistory &&
            this.chatHistory.messages &&
            this.chatHistory.messages.length >= 2
        ) {
            const { llm, llmConfig } = await this.getLLMandConfig();
            const titleGenMessage = `
------
SYSTEM:${llmConfig.systemMessage}
------
QUESTION: ${this.chatHistory.messages[0].content}
------
ANSWER: ${this.chatHistory.messages[1].content}
------
generate a short title for conversation above, 
NEVER INCLUDE any other text in your answer
TITLE:
            `;
            const titleInvokeResult = await llm.invoke(titleGenMessage);
            if (typeof titleInvokeResult.content === "string") {
                this.updateName(titleInvokeResult.content);
            } else {
                console.log("titleInvokeResult.content is not a string", titleInvokeResult);
            }
        }
    }

    async getLLMandConfig(callbacks?: Callbacks) {
        const llmConfig = await IdbLLMConfig.withLoad(this.chatOptions.llmConfigId);

        // Anthropic removed from SPA, I do not want to add a proxy server for now.
        // if (llmConfig.type === LLMTypeEnum.ChatAnthropic) {
        //     llmConfig.config.overrideRequestHeaders = {
        //         "revproxyhost": "api.anthropic.com"
        //     }
        //     llmConfig.config.anthropicApiUrl = import.meta.env.DEV ? "http://localhost:3348" : "https://proxy.webwebchat.com";
        // }

        const llm = getLLM(llmConfig, callbacks);
        return { llm, llmConfig };
    }


    async sendHumanInput(input: string, callbacks?: Callbacks) {
        const memory = new BufferMemory({
            chatHistory: this.chatHistory,
            returnMessages: true,
        });
        const { llm, llmConfig } = await this.getLLMandConfig(callbacks);
        const prompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(llmConfig.systemMessage),
            new MessagesPlaceholder("history"),
            HumanMessagePromptTemplate.fromTemplate("{input}"),
        ]);
        await new ConversationChain({
            memory,
            prompt,
            llm,
        }).call({ input });
        await this.checkAndSetChatTitle()
    }
}