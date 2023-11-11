import { IdbChatMessageHistory } from "$root/idb-models/chatHistory/IdbChatMessageHistory";
import { updateTreeItem, type Item, getTreeItem, removeTreeChat } from "$root/stores/chatListTreeviewStore";
import type { Callbacks } from "langchain/callbacks";
import { getLLM } from "./getLLM";
import { BufferMemory } from "langchain/memory";
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate } from "langchain/prompts";
import { ConversationChain } from "langchain/chains";
import { IdbChatOptionsModel } from "$root/idb-models/IdbChatOptionsModel";
import { IdbLLMConfigModel } from "$root/idb-models/IdbLLMConfigModel";

export class ChatManager {

    chatId: string;
    chatHistory: IdbChatMessageHistory;
    idbChatOptionsModel: IdbChatOptionsModel;
    chatListTreeviewItem!: Item;
    idbLLMConfigModel!: IdbLLMConfigModel;

    constructor(
        chatId: string,
        chatHistory: IdbChatMessageHistory,
        idbChatOptionsModel: IdbChatOptionsModel,
        chatListTreeviewItem: Item
    ) {
        this.chatId = chatId;
        this.chatHistory = chatHistory;
        this.idbChatOptionsModel = idbChatOptionsModel;
        this.chatListTreeviewItem = chatListTreeviewItem;
    }

    static async withLoad(chatId: string) {
        const [
            chatHistory,
            chatOptions
        ] = await Promise.all([
            IdbChatMessageHistory.withLoad(chatId),
            IdbChatOptionsModel.withLoad(chatId)
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
        this.idbLLMConfigModel = await IdbLLMConfigModel.withLoad(this.idbChatOptionsModel.llmConfigId);
    }

    async updateName(editedName: string) {
        updateTreeItem(this.chatId, { name: editedName });
        if (this.chatListTreeviewItem) {
            this.chatListTreeviewItem.name = editedName;
        }
    }

    static async delete(chatId: string) {
        await Promise.all([
            await IdbChatOptionsModel.delete(chatId),
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
        const llmConfig = await IdbLLMConfigModel.withLoad(this.idbChatOptionsModel.llmConfigId);

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