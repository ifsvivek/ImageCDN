<script>
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';

	onMount(() => {
		// Redirect to login if not authenticated
		if (!$user) {
			goto('/login');
		}
	});
</script>

<div class="mx-auto max-w-4xl p-4">
	{#if $user}
		<div class="mb-8">
			<h1 class="text-3xl font-bold">Dashboard</h1>
			<p class="mt-2 text-gray-600">Welcome back, {$user.user_name}!</p>
		</div>

		<div class="rounded-lg border bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-xl font-semibold">Profile Information</h2>
			<div class="space-y-2">
				<p><span class="font-medium">Username:</span> {$user.user_name}</p>
				<p><span class="font-medium">Email:</span> {$user.email}</p>
				<p><span class="font-medium">User ID:</span> {$user.user_id}</p>
			</div>
		</div>
	{:else}
		<p class="text-center text-gray-600">Please log in to view your dashboard.</p>
	{/if}
</div>
