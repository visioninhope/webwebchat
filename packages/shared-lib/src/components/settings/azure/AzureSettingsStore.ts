import { KEYVAL_KEYS } from '$lib/constants/idb-keys/KEYVAL_KEYS';
import { AutoSaveStoreClass } from '$lib/utils/store-helpers/AutoSaveStoreClass';

export class AzureSettingsStore
    extends AutoSaveStoreClass<AzureSettingsStore> // to make it observable like svelte store
{
    azureOpenAIApiKey: string = "";

    azureOpenAIApiVersion: string = "";

    azureOpenAIApiInstanceName: string = "";

    azureOpenAIApiDeploymentName: string = "";
}
export const azureSettingsStore = new AzureSettingsStore(KEYVAL_KEYS.AZURE_SETTINGS_STORE_KEY);