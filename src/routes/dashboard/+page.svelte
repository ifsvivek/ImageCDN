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

	onMount(async () => {
		if (!$user) goto('/login');
		await loadUserImages();
	});

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
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl px-4 py-12">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold tracking-tight text-gray-900">Image CDN Dashboard</h1>
			<p class="text-lg text-gray-600">Upload, manage and optimize your images</p>
		</div>

		<!-- Upload Section -->
		<div class="mx-auto mb-16 max-w-2xl">
			<div class="overflow-hidden rounded-2xl bg-white shadow">
				<div class="p-8">
					<div class="mb-6 flex items-center justify-between">
						<h2 class="text-xl font-semibold text-gray-900">Upload New Image</h2>
						<select
							bind:value={outputFormat}
							class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
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
							class="block w-full rounded-lg border border-gray-200 text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
						/>
						<button
							on:click={handleUpload}
							disabled={uploading || !selectedFile}
							class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
						>
							{#if uploading}
								<svg
									class="mr-2 h-4 w-4 animate-spin"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
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
						<p class="mt-2 text-sm text-gray-500">Selected: {fileName}</p>
					{/if}
				</div>
			</div>

			{#if error}
				<div class="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800" role="alert">
					{error}
				</div>
			{/if}

			{#if progress}
				<div class="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-800" role="alert">
					{progress}
				</div>
			{/if}
		</div>

		<!-- Images Grid -->
		<div class="space-y-6">
			<h2 class="text-2xl font-bold text-gray-900">Your Images</h2>
			{#if loading}
				<div class="flex items-center justify-center py-12">
					<div
						class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
					></div>
				</div>
			{:else if userImages.length === 0}
				<div class="rounded-lg bg-white p-12 text-center shadow">
					<p class="text-gray-500">No images uploaded yet.</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each userImages as image}
						<div class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
							<div class="aspect-w-16 aspect-h-9">
								<img
									src={image.urls[0]}
									alt={`User uploaded content with ${image.format} format`}
									class="h-full w-full object-cover"
								/>
							</div>
							<div class="p-4">
								<div class="mb-4 flex items-center justify-between">
									<span class="text-sm font-medium text-gray-700">Format: {image.format}</span>
									<button
										on:click={() => deleteImage(image.foldername)}
										aria-label="Delete image"
										class="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
												clip-rule="evenodd"
											/>
										</svg>
									</button>
								</div>
								<div class="flex flex-wrap gap-2">
									{#each image.urls as url, i}
										<button
											class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200"
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
