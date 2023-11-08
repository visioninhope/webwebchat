import Home from "./routes/Home.svelte";
import llmList from "./routes/llmList.svelte";
import Chat from "./routes/chat/Chat.svelte";
import Settings from "./routes/settings/Settings.svelte";

export default {
    '/': Home,
    '/settings': Settings,
    '/llms': llmList,
    '/chat/:chatId': Chat,
}
