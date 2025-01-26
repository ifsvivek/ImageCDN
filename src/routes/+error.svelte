<script>
	import { AnimatedBackground } from '$components';
	import { page } from '$app/stores';
</script>

<div class="relative min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
	<div class="absolute inset-0 overflow-hidden">
		<AnimatedBackground />
	</div>

	<div class="relative flex min-h-screen items-center justify-center px-6">
		<div class="text-center">
			<h1 class="mb-4 text-7xl font-bold tracking-tight">
				{$page.status}
				<span class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
					Error
				</span>
			</h1>

			<p class="mb-8 text-xl text-zinc-400">{$page.error?.message || 'Something went wrong'}</p>

			<a
				href="/"
				class="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3 font-medium text-white transition-all duration-300 hover:from-emerald-600 hover:to-cyan-600"
			>
				<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to Home
			</a>
		</div>
	</div>
</div>
