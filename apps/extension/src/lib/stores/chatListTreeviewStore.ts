import { generateRandomId } from "utils-vite-svelte/lib/generateRandomId";
import { KEYVAL_KEYS } from "$lib/constants/KEYVAL_KEYS";
import { ChatManager } from "$lib/chat/ChatManager";
import { StoreClass } from 'utils-vite-svelte/lib/StoreClass';
import { get as getKeyVal, set as setKeyVal } from 'idb-keyval';
import { debounce } from 'utils-vite-svelte/lib/debounce';
import { IdbChatMessageHistory } from "$lib/idb-models/chatHistory/IdbChatMessageHistory";

export interface Item {
    id: string;
    name: string;
    type: "folder" | "chat";
    children?: Item[];
    isOpen?: boolean;
    isVisible: boolean;
}

export class ChatListTreeviewModel
    extends StoreClass<ChatListTreeviewModel> // to make it observable like svelte store
{
    treeviewItems: Item[] = [];
    draggedItemId: string | null = null;
    searchString: string = "";
}

const enableAutoSave = async () => {
    chatListTreeviewStore.subscribe(() => {
        searchTreeView();
        setKeyVal(KEYVAL_KEYS.CHATLIST_TREEVIEW_STATE, chatListTreeviewStore.serialize());
    });
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
                    chatListTreeviewStore.treeviewItems[i].children![j].name.toLowerCase() + " " +
                    (await IdbChatMessageHistory
                        .withLoad(chatListTreeviewStore.treeviewItems[i].children![j].id))
                        .convertToLowerCaseSearchIndex();
            }
        } else {
            searchIndex[chatListTreeviewStore.treeviewItems[i].id] =
                chatListTreeviewStore.treeviewItems[i].name.toLowerCase() + " " +
                (await IdbChatMessageHistory
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

// type Operator = 'AND' | 'OR' | 'NOT';
// type Token = Operator | '(' | ')' | string;

// function tokenize(searchString: string): Token[] {
//     // Split the search string into tokens
//     return searchString.match(/\b(AND|OR|NOT)\b|\(|\)|"[^"]*"|'[^']*'|\S+/g) || [];
// }

// function parseFactor(tokens: Token[], index: number, item: Item): [boolean, number] {
//     if (tokens[index] === 'NOT') {
//         const result = parseFactor(tokens, index + 1, item);
//         return [!result[0], result[1]];
//     } else if (tokens[index] === '(') {
//         const result = parseExpression(tokens, index + 1, item);
//         if (tokens[result[1]] !== ')') {
//             throw new Error('Expected )');
//         }
//         return [result[0], result[1] + 1];
//     } else {
//         return [searchIndex[item.id].includes(tokens[index].toLowerCase()), index + 1];
//     }
// }

// function parseTerm(tokens: Token[], index: number, item: Item): [boolean, number] {
//     let result = parseFactor(tokens, index, item);
//     index = result[1];
//     while (index < tokens.length && tokens[index] === 'AND') {
//         const right = parseFactor(tokens, index + 1, item);
//         result = [result[0] && right[0], right[1]];
//         index = result[1];
//     }
//     return result;
// }

// function parseExpression(tokens: Token[], index: number, item: Item): [boolean, number] {
//     let result = parseTerm(tokens, index, item);
//     index = result[1];
//     while (index < tokens.length && tokens[index] === 'OR') {
//         const right = parseTerm(tokens, index + 1, item);
//         result = [result[0] || right[0], right[1]];
//         index = result[1];
//     }
//     return result;
// }

// function checkIfItemMatchesSearchString(item: Item, searchString: string): boolean {
//     const tokens = tokenize(searchString);
//     const result = parseExpression(tokens, 0, item);
//     if (result[1] !== tokens.length) {
//         throw new Error('Unexpected token ' + tokens[result[1]]);
//     }
//     return result[0];
// }

// function checkIfItemMatchesSearchString(item: Item, searchString: string): boolean {
//     // searchString is the original query
//     // lastSearchStringLowered is the toLowerCase query
//     const parsedQuery = parseBooleanQuery(searchString);
//     console.log("parsedQuery", parsedQuery);
//     return checkBooleanQuery(searchIndex[item.id], parsedQuery);
// }

// function checkBooleanQuery(searchIndex: string, query: any[]): boolean {
//     for (let i = 0; i < query.length; i++) {
//         const subQuery = query[i];
//         let matches = true;
//         for (let j = 0; j < subQuery.length; j++) {
//             const term = subQuery[j];
//             if (!searchIndex.includes(term.toLowerCase())) {
//                 matches = false;
//                 break;
//             }
//         }
//         if (matches) {
//             return true;
//         }
//     }
//     return false;
// }


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
let lastSearchStringLowered = "";
const searchTreeView = debounce(() => {
    if (lastSearchString === chatListTreeviewStore.searchString) {
        console.log("search ignored");
        return;
    } else {
        lastSearchString = chatListTreeviewStore.searchString;
        lastSearchStringLowered = lastSearchString.toLowerCase();
        if (chatListTreeviewStore.searchString !== "") {
            applySearchFilter(chatListTreeviewStore.treeviewItems, chatListTreeviewStore.searchString);
            chatListTreeviewStore.reRenderer();
        }
    }
}, 400);

const loadState = async () => {
    try {
        const storedValue = await getKeyVal<ChatListTreeviewModel>(KEYVAL_KEYS.CHATLIST_TREEVIEW_STATE);
        if (storedValue) {
            Object.assign(chatListTreeviewStore, storedValue);
            chatListTreeviewStore.reRenderer();
            generateSearchIndex();
        }
    } catch (error) {
        console.error(`Failed to load state: ${error}`);
    }
}

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

export const chatListTreeviewStore = new ChatListTreeviewModel();
Promise.resolve().then(async () => {
    await loadState();
    enableAutoSave();
    chatListTreeviewStore.reRenderer();
});

