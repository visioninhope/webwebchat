import { KEYVAL_KEYS } from 'config-helpers/idb-keys/KEYVAL_KEYS';
import { AutoSaveStoreClass } from 'utils-vite-svelte/lib/store-helpers/AutoSaveStoreClass';

export class ThemeStoreModel
    extends AutoSaveStoreClass<ThemeStoreModel> // to make it observable like svelte store
{
    theme: "light" | "dark" | "" = "";
}
export const themeStore = new ThemeStoreModel(KEYVAL_KEYS.THEME_STORE);



