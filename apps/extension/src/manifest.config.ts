import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "../package.json";

const { version, name, description } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch] = version
    // can only contain digits, dots, or dash
    .replace(/[^\d.-]+/g, "")
    // split into version parts
    .split(/[.-]/);

export default defineManifest(async (env) => ({
    manifest_version: 3,
    name: "webwebchat.com" || name,
    description: "The Chat UI to rule them all" || description,
    version: `${major}.${minor}.${patch}`,
    version_name: version,
    icons: {
        "16": "src/icons/icon-16.png",
        "32": "src/icons/icon-32.png",
        "48": "src/icons/icon-48.png",
        "128": "src/icons/icon-128.png",
    },
    content_scripts: [
        {
            id: "open-webwebchat-iframe",
            matches: ["<all_urls>"],
            exclude_matches: [
                "*://www.webwebchat.com/*",
                "*://webwebchat.com/*",
                "*://localhost:*/*",
            ],
            run_at: "document_start",
            match_about_blank: true,
            js: ["src/_content/open-webwebchat-iframe.ts"],
        },
        // {
        //     "world": "MAIN",
        //     "js": ["src/content/WORLD_MAIN/main_frame_script.ts"],
        //     "matches": ["<all_urls>"],
        //     "run_at": "document_start"
        // }
    ],
    background: {
        service_worker: "src/_bg/background.ts",
    },
    // action: {
    //     default_popup: "src/popup/popup.html",
    //     default_icon: {
    //         "16": "src/icons/icon-16.png",
    //         "32": "src/icons/icon-32.png",
    //         "48": "src/icons/icon-48.png",
    //         "128": "src/icons/icon-128.png",
    //     },
    // },
    options_ui: {
        page: "index.html#/settings",
        open_in_tab: false,
    },
    side_panel: {
        default_path: "index.html",
    },
    permissions: [
        "scripting",
        "storage",
        "sidePanel"
    ] as chrome.runtime.ManifestPermissions[],
    action: {
        default_title: "Click to open webwebCHAT",
    },
    host_permissions: ["<all_urls>"],
}));
