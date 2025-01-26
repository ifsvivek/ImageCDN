<script>
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';

	let selectedFile = null;
	let outputFormat = 'webp';
	let uploading = false;
	let error = '';
	let progress = '';
	let uploadedUrls = [];
	let userImages = [];
	let loading = true;
	let fileName = '';
	let copiedUrlIndex = null;

	async function loadUserImages() {
		try {
			const response = await fetch(`/api/upload?userId=${$user.user_id}`);
			const data = await response.json();
			if (response.ok) {
				userImages = data.images.map((img) => ({
					...img,
					urls: [256, 512, 1024, 2048].map(
						(size) =>
							`https://cdn.ifsvivek.tech/${$user.user_id}/${img.foldername}/image_${size}.${img.format}`
					)
				}));
			}
		} catch (err) {
			error = 'Failed to load images';
		} finally {
			loading = false;
		}
	}

	function handleFileSelect(e) {
		selectedFile = e.target.files[0];
		if (selectedFile) {
			fileName = selectedFile.name;
		}
	}

	async function handleUpload() {
		if (!selectedFile) {
			error = 'Please select an image file';
			return;
		}

		uploading = true;
		error = '';
		progress = 'Processing image...';

		try {
			const formData = new FormData();
			formData.append('image', selectedFile);
			formData.append('format', outputFormat);
			formData.append('userId', $user.user_id);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (!response.ok) throw new Error(result.error);

			uploadedUrls = result.urls;
			progress = 'Upload complete!';
			selectedFile = null;
			fileName = '';
			await loadUserImages();
		} catch (err) {
			error = err.message;
		} finally {
			uploading = false;
		}
	}

	async function deleteImage(foldername) {
		if (!confirm('Are you sure you want to delete this image?')) return;

		try {
			const response = await fetch('/api/upload', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: $user.user_id, timestamp: foldername })
			});

			if (!response.ok) throw new Error('Failed to delete');
			userImages = userImages.filter((img) => img.foldername !== foldername);
			await loadUserImages();
		} catch (err) {
			error = err.message;
		}
	}

	function copyUrl(url, index) {
		navigator.clipboard.writeText(url);
		copiedUrlIndex = index;
		setTimeout(() => {
			copiedUrlIndex = null;
		}, 2000);
	}

	onMount(async () => {
		if (!$user) goto('/login');
		await Promise.all([loadUserImages()]);
	});
</script>

<div class="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
	<div class="mx-auto max-w-7xl px-6 py-20">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1 class="text-5xl font-bold tracking-tighter">
				Image
				<span class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
					CDN
				</span>
			</h1>
			<p class="mt-4 text-lg text-zinc-300">Upload, manage and optimize your images</p>
		</div>

		<!-- Upload Section -->
		<div class="mx-auto mb-16 max-w-2xl">
			<div
				class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all duration-300 hover:border-emerald-500/50"
			>
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-xl font-semibold text-white">Upload New Image</h2>
					<select
						bind:value={outputFormat}
						class="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:border-emerald-500/50"
					>
						<option value="webp">WebP</option>
						<option value="jpg">JPG</option>
						<option value="png">PNG</option>
					</select>
				</div>

				<div class="flex items-center gap-4">
					<input
						type="file"
						id="file-upload"
						accept="image/*"
						on:change={handleFileSelect}
						class="block w-full rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-500/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-400"
					/>
					<button
						on:click={handleUpload}
						disabled={uploading || !selectedFile}
						class="inline-flex items-center rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50"
					>
						{#if uploading}
							<svg class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
									fill="none"
								/>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Uploading...
						{:else}
							Upload
						{/if}
					</button>
				</div>

				{#if fileName}
					<p class="mt-2 text-sm text-zinc-400">Selected: {fileName}</p>
				{/if}
			</div>

			{#if error}
				<div
					class="mt-4 rounded-lg border border-red-800 bg-red-900/20 p-4 text-sm text-red-400"
					role="alert"
				>
					{error}
				</div>
			{/if}

			{#if progress}
				<div
					class="mt-4 rounded-lg border border-emerald-800 bg-emerald-900/20 p-4 text-sm text-emerald-400"
					role="alert"
				>
					{progress}
				</div>
			{/if}
		</div>

		<!-- Images Grid -->
		<div class="space-y-6">
			<h2 class="text-2xl font-bold text-white">Your Images</h2>
			{#if loading}
				<div class="flex items-center justify-center py-12">
					<div
						class="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"
					></div>
				</div>
			{:else if userImages.length === 0}
				<div class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
					<p class="text-zinc-400">No images uploaded yet.</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each userImages as image}
						<div
							class="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:border-emerald-500/50"
						>
							<div class="aspect-w-16 aspect-h-9">
								<img
									src={image.urls[0]}
									alt={`User uploaded content with ${image.format} format`}
									class="h-full w-full object-cover"
								/>
							</div>
							<div class="p-4">
								<div class="mb-4 flex items-center justify-between">
									<span class="text-sm font-medium text-zinc-300">Format: {image.format}</span>
									<button
										on:click={() => deleteImage(image.foldername)}
										aria-label="Delete Image"
										class="rounded-full p-1.5 text-zinc-400 hover:bg-red-900/20 hover:text-red-400"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M3 6h18" />
											<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
											<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
											<line x1="10" y1="11" x2="10" y2="17" />
											<line x1="14" y1="11" x2="14" y2="17" />
										</svg>
									</button>
								</div>
								<div class="flex flex-wrap gap-2">
									{#each image.urls as url, i}
										<button
											class="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300 transition-colors duration-200 hover:bg-emerald-500/20 hover:text-emerald-400"
											on:click={() => copyUrl(url, `${image.foldername}-${i}`)}
										>
											{copiedUrlIndex === `${image.foldername}-${i}`
												? 'Copied!'
												: `${[256, 512, 1024, 2048][i]}px`}
										</button>
									{/each}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
