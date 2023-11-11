import { generateRandomId } from "$root/utils/generateRandomId";
import { KEYVAL_KEYS } from '$root/constants/idb-keys/KEYVAL_KEYS';
import { AutoSaveStoreClass } from '$root/utils/store-helpers/AutoSaveStoreClass';
import { debounce } from '$root/utils/debounce';
import { ChatManager } from "$root/managers/ChatManager";
import { IdbChatMessageHistoryModel } from "$root/idb-models/chatHistory/IdbChatMessageHistoryModel";

export interface Item {
    id: string;
    name: string;
    type: "folder" | "chat";
    children?: Item[];
    isOpen?: boolean;
    isVisible: boolean;
}

export class ChatListTreeviewModel
    extends AutoSaveStoreClass<ChatListTreeviewModel> // to make it observable like svelte store
{
    treeviewItems: Item[] = [];
    draggedItemId: string | null = null;
    searchString: string = "";
}

declare global {
    interface Window {
        searcIndex: { [id: string]: string; };
    }
}
let searchIndex: { [id: string]: string; } = {};
export const generateSearchIndex = async () => {
    searchIndex = {};
    for (let i = 0; i < chatListTreeviewStore.treeviewItems.length; i++) {
        if (
            chatListTreeviewStore.treeviewItems[i].type === "folder" &&
            chatListTreeviewStore.treeviewItems[i].children
        ) {
            for (let j = 0; j < chatListTreeviewStore.treeviewItems[i].children!.length; j++) {
                searchIndex[chatListTreeviewStore.treeviewItems[i].children![j].id] =
                    chatListTreeviewStore.treeviewItems[i].children![j].name.toLowerCase() + " "
                    +
                    (await IdbChatMessageHistoryModel
                        .withLoad(chatListTreeviewStore.treeviewItems[i].children![j].id))
                        .convertToLowerCaseSearchIndex();
            }
        } else {
            searchIndex[chatListTreeviewStore.treeviewItems[i].id] =
                chatListTreeviewStore.treeviewItems[i].name.toLowerCase() + " "
                +
                (await IdbChatMessageHistoryModel
                    .withLoad(chatListTreeviewStore.treeviewItems[i].id))
                    .convertToLowerCaseSearchIndex();

        }
    }
    window.searcIndex = searchIndex;
}

function checkIfItemMatchesSearchString(item: Item, searchString: string): boolean {
    // Split searchString into terms by ' AND '
    const terms = searchString.split(' AND ')
        .map(term => term.trim());
    for (let term of terms) {
        let notFlag = false;
        // Check for 'NOT ' operator
        if (term.startsWith('NOT ')) {
            notFlag = true;
            term = term.slice(4); // Remove 'NOT ' from term
        }

        try {
            // Replace ' OR ' with '|', '*' with '.*' (wildcard), and create a regular expression
            const regex = new RegExp(term.replace(/ OR /g, '|').replace(/\*/g, '.*'), 'i');

            // Check if the term is found within searchIndex[item.id]
            const match = regex.test(searchIndex[item.id]);

            // If 'NOT' operator is used, invert match
            if (notFlag) {
                if (match) return false; // If term is found, return false
            } else {
                if (!match) return false; // If term is not found, return false
            }
        } catch (e) {
            console.error(`Invalid regex: ${term}`);
            return false; // Return false or handle error as needed
        }
    }
    // If all terms are found (or not found when 'NOT' is used), return true
    return true;
}


function applySearchFilter(items: Item[], searchString: string): boolean {
    let isAnyChildVisible = false;
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.type === "folder" && item.children) {
            item.isVisible = applySearchFilter(item.children, searchString);
            isAnyChildVisible = isAnyChildVisible || item.isVisible;
        } else {
            item.isVisible = checkIfItemMatchesSearchString(item, searchString);
            isAnyChildVisible = isAnyChildVisible || item.isVisible;
        }
    }
    return isAnyChildVisible;
}

let lastSearchString = "";
const searchTreeView = debounce(() => {
    if (lastSearchString === chatListTreeviewStore.searchString) {
        console.log("search ignored");
        return;
    } else {
        lastSearchString = chatListTreeviewStore.searchString;
        if (chatListTreeviewStore.searchString !== "") {
            applySearchFilter(chatListTreeviewStore.treeviewItems, chatListTreeviewStore.searchString);
            chatListTreeviewStore.reRenderer();
        }
    }
}, 400);



export const removeTreeChat = (id: string) => {
    const resultObj = findItem(chatListTreeviewStore.treeviewItems, id);
    if (
        resultObj &&
        resultObj.item.type === "chat" &&
        resultObj.parent &&
        resultObj.parent.children
    ) {
        resultObj.parent.children.splice(resultObj.index, 1);
        chatListTreeviewStore.reRenderer();
    }
}

export const getTreeItem = (id: string) => {
    const resultObj = findItem(chatListTreeviewStore.treeviewItems, id);
    return resultObj ? resultObj.item : null;
}

export const addChat = (): string => {
    let newId = "";
    newId = `chat-${generateRandomId()}`;
    chatListTreeviewStore.treeviewItems.unshift({ id: newId, name: "", type: "chat", isVisible: true });
    chatListTreeviewStore.reRenderer();
    return newId;
}

export const updateTreeItem = (id: string, changes: Partial<Item>) => {
    const resultObj = findItem(chatListTreeviewStore.treeviewItems, id);
    if (resultObj) {
        Object.assign(resultObj.item, changes);
    }
    chatListTreeviewStore.reRenderer();
}

export const addFolder = (name: string, children: Item[] = []) => {
    let newId;
    newId = `folder-${generateRandomId()}`;
    chatListTreeviewStore.treeviewItems.unshift({ id: newId, name: name, type: "folder", isOpen: true, children: children, isVisible: true });
    chatListTreeviewStore.reRenderer();
    return newId;
}

export const removeFolder = (id: string) => {
    const resultObj = findItem(chatListTreeviewStore.treeviewItems, id);
    if (resultObj && resultObj.item.type === "folder" && resultObj.item.children) {
        resultObj.item.children.forEach((child: Item) => {
            if (child.type === "chat") {
                ChatManager.delete(child.id);
            }
        });
        if (resultObj.parent && resultObj.parent.children) {
            resultObj.parent.children.splice(resultObj.index, 1);
        }
    }
    chatListTreeviewStore.reRenderer();
}

type FindItemResult = {
    item: Item;
    parent: { children: Item[] } | Item;
    index: number;
}

export function findItem(items: Item[], id: string): FindItemResult | null {
    for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
            return { item: items[i], parent: { children: items }, index: i };
        }
        if (items[i].type === "folder") {
            const result = findItem(items[i].children!, id);
            if (result) {
                return { item: result.item, parent: items[i], index: result.index };
            }
        }
    }
    return null;
}

export const chatListTreeviewStore = new ChatListTreeviewModel(KEYVAL_KEYS.CHATLIST_TREEVIEW_STATE);
Promise.resolve().then(() => {
    chatListTreeviewStore.reRenderer();
    generateSearchIndex();
    chatListTreeviewStore.subscribe(() => {
        searchTreeView();
    });
});
