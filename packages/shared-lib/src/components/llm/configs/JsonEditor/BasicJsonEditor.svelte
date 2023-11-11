<script lang="ts">
	export let config: any;
	let textAreaValue = stringifyWithUndefined(config, "\t");
	let isValidJson = true;

	function stringifyWithUndefined(obj: any, tab: string) {
		let cache: any[] | null = [];
		let str = JSON.stringify(
			obj,
			(k, v) => {
				if (typeof v === "object" && v !== null) {
					if (cache) {
						if (cache.includes(v)) return;
						cache.push(v);
					}
				}
				return v === undefined ? null : v;
			},
			tab
		);
		cache = null;
		return str;
	}

	function updateConfig() {
		try {
			let parsed = JSON.parse(textAreaValue);
			config = parsed;
			isValidJson = true;
		} catch (e) {
			console.error("Invalid JSON");
			isValidJson = false;
		}
	}

	export function reloadJSON() {
		setTimeout(() => {
			textAreaValue = stringifyWithUndefined(config, "\t");
		}, 100);
	}

	reloadJSON();
</script>

<div class="alert alert-warning">
	<i class="fa-solid fa-triangle-exclamation" />
	<div>
		This is for advanced users who want to edit the config JSON directly. if it
		is not a valid JSON, it will be ignored.
	</div>
</div>
<textarea
	class="textarea w-full textarea-bordered {isValidJson
		? 'textarea-primary'
		: 'textarea-error'}"
	rows="10"
	bind:value={textAreaValue}
	on:input={updateConfig}
/>
{#if !isValidJson}
	<div class="alert alert-error">
		<i class="fa-solid fa-xmark" />
		<div>Not a valid JSON. Please fix the JSON</div>
	</div>
{/if}
