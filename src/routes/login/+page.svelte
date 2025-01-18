<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user';
	import { login } from '$lib/auth';

	let email = '';
	let password = '';
	let error = '';

	onMount(() => {
		// Redirect to dashboard if already logged in
		if ($user) {
			goto('/dashboard');
		}
	});

	async function handleSubmit() {
		try {
			const userData = await login(email, password);
			user.set(userData);
			localStorage.setItem('token', userData.token);
			goto('/dashboard');
		} catch (err) {
			error = err.message;
		}
	}
</script>

{#if !$user}
	<div class="mx-auto max-w-md">
		<h2 class="mb-4 text-2xl font-bold">Login</h2>
		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<div>
				<label for="email" class="mb-1 block">Email:</label>
				<input
					type="email"
					id="email"
					bind:value={email}
					required
					class="w-full rounded border px-3 py-2"
				/>
			</div>
			<div>
				<label for="password" class="mb-1 block">Password:</label>
				<input
					type="password"
					id="password"
					bind:value={password}
					required
					class="w-full rounded border px-3 py-2"
				/>
			</div>
			<button type="submit" class="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600">
				Login
			</button>
		</form>
		{#if error}
			<p class="mt-4 text-red-500">{error}</p>
		{/if}
		<p class="mt-4 text-center">
			Don't have an account? <a href="/signup" class="text-blue-500 hover:underline">Sign Up</a>
		</p>
	</div>
{/if}
