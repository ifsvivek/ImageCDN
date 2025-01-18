<script>
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user';
	import { signup } from '$lib/auth';

	let email = '';
	let password = '';
	let user_name = '';
	let error = '';

	async function handleSubmit() {
		try {
			const userData = await signup(email, password, user_name);
			user.set(userData);
			localStorage.setItem('token', userData.token);
			goto('/dashboard');
		} catch (err) {
			error = err.message;
		}
	}
</script>

<div class="mx-auto max-w-md">
	<h2 class="mb-4 text-2xl font-bold">Sign Up</h2>
	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<div>
			<label for="user_name" class="mb-1 block">Username:</label>
			<input
				type="text"
				id="user_name"
				bind:value={user_name}
				required
				class="w-full rounded border px-3 py-2"
			/>
		</div>
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
			Sign Up
		</button>
	</form>
	{#if error}
		<p class="mt-4 text-red-500">{error}</p>
	{/if}
	<p class="mt-4 text-center">
		Already have an account? <a href="/login" class="text-blue-500 hover:underline">Login</a>
	</p>
</div>
