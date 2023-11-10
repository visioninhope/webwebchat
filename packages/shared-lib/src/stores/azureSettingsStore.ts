import { KEYVAL_KEYS } from '$root/constants/idb-keys/KEYVAL_KEYS';
import { AutoSaveStoreClass } from '$root/utils/store-helpers/AutoSaveStoreClass';

export class AzureSettingsStore
    extends AutoSaveStoreClass<AzureSettingsStore> // to make it observable like svelte store
{
    azureOpenAIApiKey: string = "";

    azureOpenAIApiVersion: string = "";

    azureOpenAIApiInstanceName: string = "";

    azureOpenAIApiDeploymentName: string = "";

    // azureOpenAIApiEmbeddingsDeploymentName: string = "";

    // azureOpenAIApiCompletionsDeploymentName: string = "";

    // azureOpenAIBasePath: string = "";
}

export const azureSettingsStore = new AzureSettingsStore(KEYVAL_KEYS.AZURE_SETTINGS_STORE_KEY);