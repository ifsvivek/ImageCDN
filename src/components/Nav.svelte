<script>
	import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	let isOpen = false;
	let dropdownOpen = false;
	let isScrolled = false;

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function logout() {
		user.set(null);
		localStorage.removeItem('token');
		goto('/');
	}
</script>

<nav
	class="fixed z-50 w-full transition-all duration-300 {isScrolled
		? 'bg-zinc-900/80 py-4 backdrop-blur-md'
		: 'py-6'}"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6">
		<a href="/" class="text-2xl font-bold tracking-tight">
			<span class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
				>Image</span
			>
			<span class="text-white">CDN</span>
		</a>

		<!-- Desktop Navigation -->
		<div class="hidden items-center space-x-6 md:flex">
			{#if $user}
				<a href="/dashboard" class="text-zinc-300 transition-colors hover:text-white">Dashboard</a>
				<button
					on:click={logout}
					class="rounded-full bg-emerald-500 px-6 py-2 transition-colors hover:bg-emerald-600"
				>
					Logout
				</button>
			{:else}
				<a href="/login" class="text-zinc-300 transition-colors hover:text-white">Login</a>
				<a
					href="/signup"
					class="rounded-full bg-emerald-500 px-6 py-2 transition-colors hover:bg-emerald-600"
				>
					Get Started
				</a>
			{/if}
		</div>

		<!-- Mobile Menu Button -->
		<button
			on:click={() => (isOpen = !isOpen)}
			class="rounded-md p-2 text-zinc-400 hover:text-white md:hidden"
		>
			<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				{#if isOpen}
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				{:else}
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				{/if}
			</svg>
		</button>
	</div>

	<!-- Mobile Menu -->
	{#if isOpen}
		<div
			transition:slide={{ duration: 200 }}
			class="fixed inset-0 top-16 z-50 h-[calc(100vh-4rem)] bg-zinc-900/95 backdrop-blur-md md:hidden"
		>
			<div class="flex h-full flex-col space-y-4 p-6">
				{#if $user}
					<a
						href="/dashboard"
						class="block rounded-lg px-4 py-3 text-base font-medium text-zinc-300 hover:text-white"
					>
						Dashboard
					</a>
					<button
						on:click={logout}
						class="block w-full rounded-lg px-4 py-3 text-left text-base font-medium text-emerald-400 hover:text-emerald-300"
					>
						Logout
					</button>
				{:else}
					<div class="mt-auto space-y-4 p-4">
						<a
							href="/login"
							class="block w-full rounded-lg border border-zinc-700 px-4 py-3 text-center font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
						>
							Login
						</a>
						<a
							href="/signup"
							class="block w-full rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-center font-medium text-white hover:from-emerald-600 hover:to-cyan-600"
						>
							Get Started
						</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</nav>
