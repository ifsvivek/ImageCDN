<script>
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/user';
	import { Nav } from '$components';
	import '../app.css';

	onMount(() => {
		const token = localStorage.getItem('token');
		if (token) {
			try {
				const payload = JSON.parse(atob(token.split('.')[1]));
				user.set({
					user_id: payload.user_id,
					user_name: payload.user_name,
					email: payload.email,
					token: token
				});
			} catch (err) {
				console.error('Error parsing token:', err);
				localStorage.removeItem('token');
			}
		}
	});
</script>

<div class="min-h-screen bg-gray-50">
	<Nav />
	<slot />
</div>
