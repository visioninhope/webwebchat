// @ts-ignore
import * as Browser from 'webextension-polyfill';
import { registerMainWorldScript } from './MAIN_WORLD/register-main-world-script';

registerMainWorldScript();

Browser.runtime.onInstalled.addListener(() => {
    console.log("webex bg onInstalled...");
});

Browser.action.onClicked.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL('index.html'),
    });
});



// import { storage } from "../storage";
// // Background service workers
// // https://developer.chrome.com/docs/extensions/mv3/service_workers/

// chrome.runtime.onInstalled.addListener(() => {
//     storage.get().then(console.log);
// });

// // NOTE: If you want to toggle the side panel from the extension's action button,
// // you can use the following code:
// // chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
// //    .catch((error) => console.error(error));