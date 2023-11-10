<script lang="ts">
	import { BASE_NAV } from "shared-lib/src/constants//BASE_NAV";
	import TextareaResize from "shared-lib/src/components/TextareaResize.svelte";
	import { HumanMessage } from "langchain/schema";
	import { push as goto } from "svelte-spa-router";
	import { ChatManager } from "$lib/chat/ChatManager";
	import { onMount } from "svelte";
	import Header from "./Header.svelte";
	import Options from "./Options.svelte";
	import MarkdownEditable from "shared-lib/src/components/markdown/MarkdownEditable.svelte";
	import Markdown from "shared-lib/src/components/markdown/Markdown.svelte";
	import { chatSettingsStore } from "shared-lib/src/components/settings/chatSettingsStore";

	export let params = {
		chatId: "undefined_chatId",
	};

	let isSendMessageLoading = false;
	let streamingAIResponse = "";
	let currentHumanInput = "";
	let inputValue = "";
	let errorMessage = "";

	let chatManager: ChatManager;

	onMount(async () => {
		try {
			chatManager = await ChatManager.withLoad(params.chatId);
		} catch (e) {
			console.log(e);
			goto(BASE_NAV.HOME);
		}
		setTimeout(() => {
			scrollToBottom();
		}, 100);
	});

	function scrollToBottom() {
		if (document.body.parentElement) {
			document.body.parentElement.scrollTo(
				0,
				document.body.parentElement.scrollHeight
			);
		}
	}

	function onkeydown(e: Event) {
		if (
			(e as KeyboardEvent).key === "Enter" &&
			$chatSettingsStore.isSendMessageOnEnterEnabled
		) {
			sendMesage();
		}
	}

	async function confirmDelete() {
		await ChatManager.delete(params.chatId);
		goto(BASE_NAV.HOME);
	}

	async function sendMesage() {
		errorMessage = "";
		if (isSendMessageLoading) {
			return;
		}
		if (inputValue.trim().length === 0) {
			inputValue = "";
			return;
		}
		isSendMessageLoading = true;

		currentHumanInput = inputValue.trim();
		inputValue = "";
		setTimeout(() => {
			inputValue = "";
		}, 100);
		streamingAIResponse = "";

		try {
			await chatManager.sendHumanInput(currentHumanInput, [
				{
					handleLLMNewToken(token: string) {
						streamingAIResponse += token;
					},
				},
			]);
		} catch (e) {
			console.log(e);
			inputValue = currentHumanInput; // restore input value
			if (e instanceof Error) {
				errorMessage = e.message;
			}
		}

		if (chatManager.chatHistory) {
			chatManager.chatHistory.messages =
				(await chatManager.chatHistory.getMessages()) || [];
		}
		currentHumanInput = "";
		streamingAIResponse = "";
		isSendMessageLoading = false;
		scrollToBottom();
		// svelte do not update title automatically
		chatManager = chatManager;
	}
	async function saveMessage(event: CustomEvent) {
		console.log("event.detail");
		console.log(event.detail);
		console.log("chatManager.chatHistory.messages");
		console.log(chatManager.chatHistory.messages);
		await chatManager.chatHistory.updateMessage(
			event.detail.content,
			event.detail.index
		);
	}
</script>

<div class="min-h-full flex flex-col justify-between">
	<div class="">
		<Header {chatManager} on:confirmDelete={confirmDelete} />
	</div>

	{#if chatManager}
		<Options {chatManager} />
	{/if}

	<div>
		{#if chatManager?.chatHistory}
			{#each chatManager.chatHistory?.messages || [] as message, index}
				<div
					class="my-6 rounded-lg px-3 py-2 flex {message instanceof HumanMessage
						? ' border border-primary'
						: ' border '}"
				>
					<div class="mr-2">
						<div
							class="bg-base-300 text-base-content rounded w-8 h-8 text-center"
						>
							{#if message instanceof HumanMessage}
								<i class="fa-solid fa-user" />
							{:else}
								<i class="fa-solid fa-robot" />
							{/if}
						</div>
					</div>
					<div class="w-full overflow-auto chat-message-container">
						{#if typeof message.content === "string"}
							<MarkdownEditable
								{index}
								source={message.content}
								on:save={saveMessage}
							/>
						{:else}
							unknown message type
						{/if}
					</div>
				</div>
			{/each}
		{/if}

		<!-- show input until get the answer -->
		{#if isSendMessageLoading}
			<div class="my-6 rounded-lg px-3 py-2 flex border border-primary">
				<div class="mr-2">
					<i class="fa-solid fa-user btn btn-square btn-sm" />
				</div>
				<div class="w-full chat-message-container">
					<Markdown source={currentHumanInput} />
				</div>
			</div>
		{/if}

		<!-- show streamming response while getting response -->
		{#if isSendMessageLoading}
			<div class="my-6 rounded-lg px-3 py-2 flex border">
				<div class="mr-2">
					<i class="fa-solid fa-robot btn btn-square btn-sm" />
				</div>
				<div class="w-full chat-message-container">
					<div class="animate-pulse">
						<span class="loading loading-spinner" />
						...
					</div>
					<Markdown source={streamingAIResponse} />
				</div>
			</div>
		{/if}
	</div>

	<div class="my-10" />

	<div class="sticky bottom-0 w-full pb-4">
		{#if errorMessage}
			<div class="alert alert-error">
				<i class="fa-solid fa-triangle-exclamation" />
				<span>{errorMessage}</span>
			</div>
		{/if}
		<form class="flex h-full relative" on:submit|preventDefault={sendMesage}>
			<div class="flex-grow">
				<TextareaResize
					bind:value={inputValue}
					placeholder="Type here"
					rows="1"
					autofocus
					class="textarea textarea-bordered bg-base-200 textarea-lg w-full mr-10"
					on:keydown={onkeydown}
				/>
			</div>
			<div class="flex flex-col space-y-1 ml-2">
				<button type="submit" class="btn btn-sm btn-square">
					<i class="fa-solid fa-paper-plane" />
				</button>
				<label
					title="toogle return button"
					class=" btn btn-sm btn-square swap {$chatSettingsStore.isSendMessageOnEnterEnabled
						? ''
						: 'opacity-30'} "
				>
					<!-- data-tip="toogle return button" -->
					<input
						class="btn-sm btn-square"
						type="checkbox"
						bind:checked={$chatSettingsStore.isSendMessageOnEnterEnabled}
					/>
					<div class="swap-on">⏎</div>
					<div class="swap-off relative">
						⏎
						<i class="fa-solid fa-slash absolute left-1 -top-2" />
					</div>
				</label>
			</div>
		</form>
	</div>
</div>
