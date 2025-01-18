<script>
	import { user } from '$lib/stores/user';
</script>

<div class="text-center">
	<h1 class="mb-4 text-4xl font-bold">Welcome to our App</h1>
	{#if $user}
		<p class="text-xl">Hello, {$user.user_name}!</p>
		<a href="/dashboard" class="text-blue-500 hover:underline">Go to Dashboard</a>
	{:else}
		<p class="text-xl">Please log in or sign up to continue.</p>
		<div class="mt-4">
			<a href="/login" class="mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				>Login</a
			>
			<a href="/signup" class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
				>Sign Up</a
			>
		</div>
	{/if}
</div>
