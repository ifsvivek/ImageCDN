<script>
	import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';

	let isOpen = false;
	let dropdownOpen = false;

	function logout() {
		user.set(null);
		localStorage.removeItem('token');
		goto('/');
	}

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function toggleDropdown(event) {
		event.stopPropagation();
		dropdownOpen = !dropdownOpen;
	}

	function closeDropdown() {
		dropdownOpen = false;
	}

	function closeMobileMenu() {
		isOpen = false;
	}
</script>

<nav class="fixed top-0 z-50 w-full bg-white/75 shadow-lg backdrop-blur-sm">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<div class="flex items-center">
				<a href="/" class="flex items-center space-x-2">
					<span
						class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent"
					>
						ImageCDN
					</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden items-center space-x-8 md:flex">
				<a
					href="/"
					class="nav-link {$page.url.pathname === '/' ? 'text-blue-600' : 'text-gray-600'}"
				>
					Home
				</a>
				{#if $user}
					<a
						href="/dashboard"
						class="nav-link {$page.url.pathname === '/dashboard'
							? 'text-blue-600'
							: 'text-gray-600'}"
					>
						Dashboard
					</a>
				{/if}
			</div>

			<!-- Desktop Auth Section -->
			<div class="hidden items-center space-x-4 md:flex">
				{#if $user}
					<div class="relative" on:click_outside={closeDropdown}>
						<button
							on:click={toggleDropdown}
							class="flex items-center space-x-2 rounded-full bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200"
						>
							<span class="text-sm font-medium text-gray-700">{$user.user_name}</span>
							<svg
								class="h-4 w-4 text-gray-600 transition-transform {dropdownOpen
									? 'rotate-180'
									: ''}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>

						{#if dropdownOpen}
							<div
								transition:slide={{ duration: 200 }}
								class="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
							>
								<div class="py-1">
									<button
										on:click={logout}
										class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
									>
										Logout
									</button>
								</div>
							</div>
						{/if}
					</div>
				{:else}
					<a
						href="/login"
						class="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
					>
						Login
					</a>
					<a
						href="/signup"
						class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					>
						Sign Up
					</a>
				{/if}
			</div>

			<!-- Mobile Menu Button -->
			<button
				on:click={toggleMenu}
				class="rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none md:hidden"
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
	</div>

	<!-- Mobile Menu -->
	{#if isOpen}
		<div
			transition:slide={{ duration: 200 }}
			class="fixed inset-0 top-16 z-50 h-[calc(100vh-4rem)] bg-white md:hidden"
		>
			<div class="flex h-full flex-col space-y-4 p-4">
				<a
					href="/"
					on:click={closeMobileMenu}
					class="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
				>
					Home
				</a>
				{#if $user}
					<a
						href="/dashboard"
						on:click={closeMobileMenu}
						class="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
					>
						Dashboard
					</a>
					<button
						on:click={() => {
							closeMobileMenu();
							logout();
						}}
						class="block w-full rounded-lg px-4 py-3 text-left text-base font-medium text-red-600 hover:bg-red-50"
					>
						Logout
					</button>
				{:else}
					<div class="mt-auto space-y-4 p-4">
						<a
							href="/login"
							on:click={closeMobileMenu}
							class="block w-full rounded-lg bg-gray-100 px-4 py-3 text-center font-medium text-gray-700 hover:bg-gray-200"
						>
							Login
						</a>
						<a
							href="/signup"
							on:click={closeMobileMenu}
							class="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700"
						>
							Sign Up
						</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</nav>

<style>
	.nav-link {
		@apply relative px-1 py-2 text-sm font-medium transition-colors;
	}

	.nav-link::after {
		content: '';
		@apply absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300;
	}

	.nav-link:hover::after {
		@apply w-full;
	}
</style>
