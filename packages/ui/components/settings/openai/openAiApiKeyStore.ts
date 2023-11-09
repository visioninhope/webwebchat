import { KEYVAL_KEYS } from 'config-helpers/idb-keys/KEYVAL_KEYS';
import { AutoSaveStoreClass } from 'utils-vite-svelte/lib/store-helpers/AutoSaveStoreClass';

export class OpenAiApiKeyModel
    extends AutoSaveStoreClass<OpenAiApiKeyModel> // to make it observable like svelte store
{
    openAIApiKey: string = "";
}
export const openAiApiKeyStore = new OpenAiApiKeyModel(KEYVAL_KEYS.OPEN_AI_API_KEY);



