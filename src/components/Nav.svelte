<script>
	import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';

	function logout() {
		user.set(null);
		localStorage.removeItem('token');
		goto('/');
	}
</script>

<nav class="bg-white shadow-md">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 justify-between">
			<div class="flex">
				<div class="flex flex-shrink-0 items-center">
					<a href="/" class="text-xl font-bold text-gray-800">ImageCDN</a>
				</div>

				<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
					<a
						href="/"
						class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
					>
						Home
					</a>
					{#if $user}
						<a
							href="/dashboard"
							class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
						>
							Dashboard
						</a>
					{/if}
				</div>
			</div>

			<div class="hidden sm:ml-6 sm:flex sm:items-center">
				{#if $user}
					<span class="mr-4 text-sm text-gray-500">Welcome, {$user.user_name}!</span>
					<button
						on:click={logout}
						class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
					>
						Logout
					</button>
				{:else}
					<a
						href="/login"
						class="mr-3 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
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
		</div>
	</div>
</nav>
