import { KEYVAL_KEYS } from '../../../constants/idb-keys/KEYVAL_KEYS';
import { AutoSaveStoreClass } from '../../../utils/store-helpers/AutoSaveStoreClass';

export class ThemeStoreModel
    extends AutoSaveStoreClass<ThemeStoreModel> // to make it observable like svelte store
{
    theme: "light" | "dark" | "" = "";
}
export const themeStore = new ThemeStoreModel(KEYVAL_KEYS.THEME_STORE);



