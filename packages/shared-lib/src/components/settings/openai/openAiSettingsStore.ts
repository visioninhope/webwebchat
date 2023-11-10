import { KEYVAL_KEYS } from '$root/constants/idb-keys/KEYVAL_KEYS';
import { AutoSaveStoreClass } from '$root/utils/store-helpers/AutoSaveStoreClass';

export class OpenAiSettingsStore
    extends AutoSaveStoreClass<OpenAiSettingsStore> // to make it observable like svelte store
{
    openAIApiKey: string = "";
}
export const openAiSettingsStore = new OpenAiSettingsStore(KEYVAL_KEYS.OPEN_AI_SETTINGS_STORE_KEY);



