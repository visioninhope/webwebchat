<script lang="ts">
	import { BASE_NAV } from "config-helpers/BASE_NAV";
	import { location } from "svelte-spa-router";
	export let openSideBar = () => {};
	const icons = [
		"bomb",
		"poo",
		"camera-retro",
		"ghost",
		"fire",
		"code",
		"brush",
		"dumpster-fire",
		"bath",
		"business-time",
		"mug-saucer",
		"poo-storm",
		"user-secret",
		"motorcycle",
		"record-vinyl",
		"virus",
		"dragon",
		"umbrella-beach",
		"whiskey-glass",
		"user-astronaut",
		"stroopwafel",
		"toolbox",
		"socks",
		"skull-crossbones",
		"person-biking",
		"meteor",
		"ice-cream",
		"hat-wizard",
		"hand-spock",
		"hand-sparkles",
		"guitar",
		"golf-ball-tee",
		"font-awesome",
		"floppy-disk",
		"broom-ball",
		"beer-mug-empty",
		"font-awesome",
		"hand-spock",
		"font-awesome",
		"floppy-disk",
	];
	let randomIcon: string;
	function rndIcon() {
		randomIcon = icons[Math.floor(Math.random() * icons.length)];
	}
	setInterval(rndIcon, 60e3);
</script>

<!-- Navbar -->
<div
	class="
  sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100
  bg-base-200 text-base-content
  "
>
	<nav class="navbar w-full">
		<div class="navbar-start">
			<!-- sidebar menu button START -->
			<span
				class="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]"
				data-tip="Menu"
			>
				<button
					aria-label="Open menu"
					class="btn btn-square btn-ghost drawer-button"
					on:click={openSideBar}
				>
					<i class="fa-solid fa-bars" />
				</button>
				<!-- <label
					aria-label="Open menu"
					for="my-drawer-3"
					class="btn btn-square btn-ghost drawer-button lg:hidden"
				>
					<i class="fa-solid fa-bars" />
				</label> -->
			</span>
			<!-- sidebar menu button END -->

			<!-- logo start -->
			<!-- lg:hidden -->
			<div class="flex items-center gap-2 navbar-logo">
				<a
					href={BASE_NAV.HOME}
					on:click={rndIcon}
					class="flex-0 btn btn-ghost px-2"
				>
					<div class="font-title font-extrabold text-lg md:text-2xl">
						<!-- <i class="fa-solid fa-toolbox text-2xl mr-2" /> -->
						<!-- <i class="fa-solid fa-user-secret text-2xl mr-2" /> -->
						{#if randomIcon}
							<i
								title="just a random icon, ignore me!"
								class="fa-solid fa-{randomIcon} text-2xl mr-2 text-primary"
							/>
						{/if}

						<div
							class="inline-flex"
							class:underline={$location === BASE_NAV.RM_HASH(BASE_NAV.HOME)}
						>
							<span class="capitalize">Web</span>
							<span class="capitalize">Web</span>
							<span class="capitalize text-primary">Chat</span>
							<span class="lowercase">.com</span>
						</div>
					</div>
				</a>
			</div>
			<!-- logo end -->
		</div>
		<!-- <NavbarCenter />
    <NavbarEnd /> -->
	</nav>
</div>
<!-- Navbar -->
