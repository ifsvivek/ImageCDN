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

<div class="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
	<div class="mx-auto max-w-7xl px-4 py-20">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1 class="text-5xl font-bold tracking-tighter">
				Create
				<span class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
					Account
				</span>
			</h1>
			<p class="mt-4 text-lg text-zinc-300">Join ImageCDN today</p>
		</div>

		<div class="mx-auto max-w-md">
			<div
				class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all duration-300 hover:border-emerald-500/50"
			>
				<form on:submit|preventDefault={handleSubmit} class="space-y-6">
					<div>
						<label for="user_name" class="block text-sm font-medium text-zinc-300">Username</label>
						<input
							type="text"
							id="user_name"
							bind:value={user_name}
							required
							class="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-400 focus:border-emerald-500 focus:ring-emerald-500"
						/>
					</div>
					<div>
						<label for="email" class="block text-sm font-medium text-zinc-300">Email</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							required
							class="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-400 focus:border-emerald-500 focus:ring-emerald-500"
						/>
					</div>
					<div>
						<label for="password" class="block text-sm font-medium text-zinc-300">Password</label>
						<input
							type="password"
							id="password"
							bind:value={password}
							required
							class="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-400 focus:border-emerald-500 focus:ring-emerald-500"
						/>
					</div>
					<button
						type="submit"
						class="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-all duration-300 hover:from-emerald-600 hover:to-cyan-600"
					>
						Sign Up
					</button>
				</form>

				{#if error}
					<div
						class="mt-4 rounded-lg border border-red-800 bg-red-900/20 p-4 text-sm text-red-400"
						role="alert"
					>
						{error}
					</div>
				{/if}

				<p class="mt-6 text-center text-sm text-zinc-400">
					Already have an account?
					<a href="/login" class="font-medium text-emerald-400 hover:text-emerald-300">Login</a>
				</p>
			</div>
		</div>
	</div>
</div>
