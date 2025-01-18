<script>
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/user';
	import { AnimatedBackground } from '$components';

	let isScrolled = false;

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
	$: isLoggedIn = $user !== null;
</script>

<div class="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
	<!-- Hero Section -->
	<div class="relative px-6 pb-20 pt-32">
		<div class="absolute inset-0 overflow-hidden">
			<AnimatedBackground />
		</div>
		<div class="relative mx-auto max-w-4xl space-y-8 text-center">
			<h1 class="text-5xl font-bold tracking-tighter sm:text-6xl lg:text-7xl">
				Images Optimized for
				<span class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
					Modern Web
				</span>
			</h1>
			<p class="mx-auto max-w-2xl text-lg text-zinc-300 sm:text-xl">
				Upload once, serve everywhere. Automatic optimization, multiple formats, and lightning-fast
				delivery.
			</p>
			<div class="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row sm:gap-6">
				{#if isLoggedIn}
					<a
						href="/dashboard"
						class="w-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 font-medium text-white shadow-lg transition-all duration-300 hover:from-emerald-600 hover:to-cyan-600 hover:shadow-emerald-500/25 sm:w-auto"
					>
						Go to Dashboard
					</a>
				{:else}
					<a
						href="/signup"
						class="w-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 font-medium text-white shadow-lg transition-all duration-300 hover:from-emerald-600 hover:to-cyan-600 hover:shadow-emerald-500/25 sm:w-auto"
					>
						Start Optimizing
					</a>
					<a
						href="#features"
						class="w-full rounded-full border border-zinc-700 px-8 py-4 text-zinc-300 transition-all duration-300 hover:border-zinc-600 hover:text-white sm:w-auto"
					>
						Learn More
					</a>
				{/if}
			</div>
		</div>
	</div>

	<!-- Features Grid -->
	<div id="features" class="mx-auto max-w-7xl px-6 py-24">
		<div class="grid gap-8 md:grid-cols-3">
			<!-- Feature 1 -->
			<div
				class="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all duration-300 hover:border-emerald-500/50"
			>
				<div
					class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500"
				>
					<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-semibold">Smart Optimization</h3>
				<p class="text-zinc-400">
					Automatically optimize and convert your images to WebP, AVIF, and traditional formats.
				</p>
			</div>

			<!-- Feature 2 -->
			<div
				class="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all duration-300 hover:border-emerald-500/50"
			>
				<div
					class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500"
				>
					<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 8v8m0 0h8m-8 0l6-6m4 2v6m0 0h-8m8 0l-6-6"
						/>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-semibold">Responsive Variants</h3>
				<p class="text-zinc-400">
					Get multiple size variants automatically generated for every image you upload.
				</p>
			</div>

			<!-- Feature 3 -->
			<div
				class="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all duration-300 hover:border-emerald-500/50"
			>
				<div
					class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500"
				>
					<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-semibold">Lightning Fast</h3>
				<p class="text-zinc-400">
					Global CDN ensures your images load quickly for users worldwide.
				</p>
			</div>
		</div>
	</div>

	<!-- Activation Notice -->
	<div class="mx-auto max-w-3xl px-6 pb-24">
		<div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
			<div class="flex items-start gap-4">
				<svg
					class="h-6 w-6 flex-shrink-0 text-emerald-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<p class="text-sm text-emerald-300">
					Note: After uploading, please allow up to 20 minutes for your images to be processed and
					become available through the CDN. This ensures optimal compression and format conversion.
				</p>
			</div>
		</div>
	</div>
</div>
