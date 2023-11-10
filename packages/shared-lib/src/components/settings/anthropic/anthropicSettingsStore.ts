import { KEYVAL_KEYS } from '$root/constants/idb-keys/KEYVAL_KEYS';
import { AutoSaveStoreClass } from '$root/utils/store-helpers/AutoSaveStoreClass';

export class AnthropicSettingsStore
    extends AutoSaveStoreClass<AnthropicSettingsStore> // to make it observable like svelte store
{
    anthropicApiKey: string = "";
}
export const anthropicSettingsStore = new AnthropicSettingsStore(KEYVAL_KEYS.ANTHROPIC_SETTINGS_STORE_KEY);



