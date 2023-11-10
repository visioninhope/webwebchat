import { KEYVAL_KEYS } from '$root/constants/idb-keys/KEYVAL_KEYS';
import { AutoSaveStoreClass } from '$root/utils/store-helpers/AutoSaveStoreClass';

export class ThemeSettingsStore
    extends AutoSaveStoreClass<ThemeSettingsStore> // to make it observable like svelte store
{
    theme: "light" | "dark" | "" = "";
}
export const themeSettingsStore = new ThemeSettingsStore(KEYVAL_KEYS.THEME_SETTINGS_STORE);



