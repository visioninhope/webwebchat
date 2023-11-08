import Browser from "webextension-polyfill";
// @ts-ignore
import mainWorld from '../../_content/MAIN_WORLD/main_frame_script?script&module'

export const registerMainWorldScript = () => {
    try {
        Browser.scripting.registerContentScripts([
            {
                id: 'ALL-URLS-MAIN-WORLD',
                js: [
                    mainWorld
                ],
                matches: ["<all_urls>"],
                runAt: 'document_start',
                // @ts-ignore
                world: 'MAIN',
            },
        ]);
    } catch (e) {
        console.log("ERROR: Browser.scripting.registerContentScripts")
        console.log(e)
    }
}