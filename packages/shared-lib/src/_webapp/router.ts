import ChatRoute from "./routes/ChatRoute.svelte";
import HomeRoute from "./routes/HomeRoute.svelte";
import SettingsLlmListRoute from "./routes/SettingsLLMListRoute.svelte";
import SettingsRoute from "./routes/SettingsRoute.svelte";

export default {
    '/': HomeRoute,
    '/settings': SettingsRoute,
    '/settings/llms': SettingsLlmListRoute,
    '/chat/:chatId': ChatRoute,
}
