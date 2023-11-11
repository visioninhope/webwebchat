<script lang="ts">
	import Chat from "$root/components/chat/Chat.svelte";
	export let params = {
		chatId: "undefined_chatId",
	};
</script>

<Chat chatId={params.chatId} />
