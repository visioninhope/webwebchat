
import { KEYVAL_KEYS } from '$root/constants/idb-keys/KEYVAL_KEYS';
import { AutoSaveStoreClass } from '$root/utils/store-helpers/AutoSaveStoreClass';

export class ChatSettingsStore
    extends AutoSaveStoreClass<ChatSettingsStore> // to make it observable like svelte store
{
    isSendMessageOnEnterEnabled: boolean = true;
    defaultLLMConfigId: string = "";
}
export const chatSettingsStore = new ChatSettingsStore(KEYVAL_KEYS.CHAT_SETTINGS_KEY);