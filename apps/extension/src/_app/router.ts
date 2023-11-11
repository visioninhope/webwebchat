import Home from "./routes/Home.svelte";
import llmList from "./routes/llmList.svelte";
import Chat from "./routes/Chat.svelte";
import Settings from "./routes/Settings.svelte";

export default {
    '/': Home,
    '/settings': Settings,
    '/settings/llms': llmList,
    '/chat/:chatId': Chat,
}
