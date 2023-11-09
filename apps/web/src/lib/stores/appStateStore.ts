import { KEYVAL_KEYS } from 'config-helpers/idb-keys/KEYVAL_KEYS';
import { AutoSaveStoreClass } from 'utils-vite-svelte/lib/store-helpers/AutoSaveStoreClass';

export class AppStateModel
    extends AutoSaveStoreClass<AppStateModel> // to make it observable like svelte store
{
    defaultLLMConfigId: string = "";

    isSendMessageOnEnterEnabled: boolean = true;

    theme: "light" | "dark" | "" = '';

    // ============ OpenAI ============
    openAIApiKey: string = "";

    // ============ Azure OpenAI ============
    azureOpenAIApiKey: string = "";

    azureOpenAIApiVersion: string = "";

    azureOpenAIApiInstanceName: string = "";

    azureOpenAIApiDeploymentName: string = "";

}

export const appStateStore = new AppStateModel(KEYVAL_KEYS.APP_STATE);



