import { KEYVAL_KEYS } from 'shared-lib/src/constants//idb-keys/KEYVAL_KEYS';
import { AutoSaveStoreClass } from 'shared-lib/src/utils/store-helpers/AutoSaveStoreClass';

export class AppStateModel
    extends AutoSaveStoreClass<AppStateModel> // to make it observable like svelte store
{

    defaultLLMConfigId: string = "";

    theme: "light" | "dark" | "" = '';

    // ============ OpenAI ============
    openAIApiKey: string = "";

    // ============ Azure OpenAI ============
    azureOpenAIApiKey: string = "";

    azureOpenAIApiVersion: string = "";

    azureOpenAIApiInstanceName: string = "";

    azureOpenAIApiDeploymentName: string = "";

    // ============ Anthropic ============
    anthropicApiKey: string = "";

}

export const appStateStore = new AppStateModel(KEYVAL_KEYS.APP_STATE);



