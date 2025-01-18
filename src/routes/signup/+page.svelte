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

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl px-4 py-12">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold tracking-tight text-gray-900">Create Account</h1>
			<p class="text-lg text-gray-600">Join ImageCDN today</p>
		</div>

		<div class="mx-auto max-w-md">
			<div class="overflow-hidden rounded-2xl bg-white p-8 shadow">
				<form on:submit|preventDefault={handleSubmit} class="space-y-6">
					<div>
						<label for="user_name" class="block text-sm font-medium text-gray-700">Username</label>
						<input
							type="text"
							id="user_name"
							bind:value={user_name}
							required
							class="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							required
							class="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
						<input
							type="password"
							id="password"
							bind:value={password}
							required
							class="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>
					<button
						type="submit"
						class="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
					>
						Sign Up
					</button>
				</form>

				{#if error}
					<div class="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800" role="alert">
						{error}
					</div>
				{/if}

				<p class="mt-6 text-center text-sm text-gray-600">
					Already have an account?
					<a href="/login" class="font-medium text-blue-600 hover:text-blue-500">Login</a>
				</p>
			</div>
		</div>
	</div>
</div>
