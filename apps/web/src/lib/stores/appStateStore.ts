import { KEYVAL_KEYS } from '$lib/constants/KEYVAL_KEYS';
import { StoreClass } from 'utils-vite-svelte/lib/storeHelpers/StoreClass';
import { get as getKeyVal, set as setKeyVal } from 'idb-keyval';
import { IdbLLMConfig } from '$lib/idb-models/IdbLLMConfig';
import { llmConfigList, waitUntil_llmConfigListReady } from '$lib/stores/LLMConfigList';
import { debounce } from 'utils-vite-svelte/lib/debounce';

export class AppStateModel
    extends StoreClass<AppStateModel> // to make it observable like svelte store
{

    defaultLLMConfigId: string = "";

    isSendMessageOnEnterEnabled: boolean = true;

    theme: "light" | "dark" | "auto" = 'auto';

    // ============ OpenAI ============
    openAIApiKey: string = "";

    // ============ Azure OpenAI ============
    azureOpenAIApiKey: string = "";

    azureOpenAIApiVersion: string = "";

    azureOpenAIApiInstanceName: string = "";

    azureOpenAIApiDeploymentName: string = "";


    async loadState() {
        try {
            const storedValue = await getKeyVal<AppStateModel>(KEYVAL_KEYS.APP_STATE);
            if (storedValue) {
                Object.assign(this, storedValue);
            }
            this.checkDefaultModel(); // llmConfigList.list can be [] at start!!!!
        } catch (error) {
            console.error(`Failed to load state: ${error}`);
        }
    }

    async checkDefaultModel() {
        await waitUntil_llmConfigListReady();
        if (this.defaultLLMConfigId !== "") {
            if (llmConfigList.list.findIndex((model) => model.llmConfigId === this.defaultLLMConfigId) === -1) {
                this.defaultLLMConfigId = "";
            }
        }
        if (this.defaultLLMConfigId === "") {
            if (llmConfigList.list.length > 0) {
                this.defaultLLMConfigId = llmConfigList.list[0].llmConfigId;
            } else {
                const idbLLMConfig = new IdbLLMConfig();
                this.defaultLLMConfigId = await idbLLMConfig.save();
            }
        }
    }

    enableAutoSave() {
        const debouncedSave = debounce(() => {
            setKeyVal(KEYVAL_KEYS.APP_STATE, this.serialize());
        }, 2000);
        // toastStore.addItem({
        //     class: "alert-success",
        //     message: "Saved",
        // });

        this.subscribe(() => {
            debouncedSave();
        });
    }

}

export const appStateStore = new AppStateModel();
Promise.resolve().then(async () => {
    await appStateStore.loadState();
    appStateStore.enableAutoSave();
});



