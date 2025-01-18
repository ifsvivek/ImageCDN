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

	async function deleteImage(foldername) {
		if (!confirm('Are you sure you want to delete this image?')) return;

		try {
			const response = await fetch('/api/upload', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: $user.user_id, timestamp: foldername })
			});

			if (!response.ok) throw new Error('Failed to delete');

			// Remove the deleted image from the userImages array
			userImages = userImages.filter((img) => img.foldername !== foldername);

			// Refresh the images list
			await loadUserImages();
		} catch (err) {
			error = err.message;
		}
	}

	function copyUrl(url) {
		navigator.clipboard.writeText(url);
		progress = 'URL copied to clipboard!';
		setTimeout(() => (progress = ''), 2000);
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
		} catch (err) {
			error = err.message;
		} finally {
			uploading = false;
		}
	}
</script>

<div class="p-4">
	<h1 class="mb-4 text-2xl">Upload Image</h1>

	<form on:submit|preventDefault={handleUpload} class="space-y-4">
		<div>
			<label for="image-input" class="block">Image File:</label>
			<input
				id="image-input"
				type="file"
				accept="image/*"
				on:change={(e) => (selectedFile = e.target.files[0])}
				disabled={uploading}
			/>
		</div>

		<div>
			<label for="format-select" class="block">Output Format:</label>
			<select id="format-select" bind:value={outputFormat} disabled={uploading}>
				<option value="webp">WebP</option>
				<option value="jpg">JPG</option>
				<option value="png">PNG</option>
			</select>
		</div>

		<button type="submit" disabled={uploading} class="rounded bg-blue-500 px-4 py-2 text-white">
			{uploading ? 'Uploading...' : 'Upload'}
		</button>

		{#if uploadedUrls.length > 0}
			<div class="mt-4">
				<h3 class="text-lg font-semibold">Uploaded Image URLs:</h3>
				<ul class="list-disc pl-5">
					{#each uploadedUrls as url}
						<li>
							<a href={url} target="_blank" class="text-blue-500 hover:underline">{url}</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
		<div class="mt-8">
			<h2 class="mb-4 text-xl font-semibold">Your Images</h2>

			{#if loading}
				<p>Loading your images...</p>
			{:else if userImages.length === 0}
				<p>No images uploaded yet.</p>
			{:else}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
					{#each userImages as image}
						<div class="rounded border p-4">
							<img src={image.urls[0]} alt="Thumbnail" class="mb-2 h-32 w-full object-cover" />
							<div class="space-y-2">
								<div class="text-sm text-gray-600">
									Format: {image.format}<br />
								</div>
								<div class="flex flex-wrap gap-2">
									{#each image.urls as url, i}
										<button
											class="text-sm text-blue-500 hover:underline"
											on:click={() => copyUrl(url)}
										>
											{[256, 512, 1024, 2048][i]}px
										</button>
									{/each}
								</div>
								<button
									class="text-sm text-red-500 hover:text-red-700"
									on:click={() => deleteImage(image.foldername)}
								>
									Delete
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		{#if error}
			<p class="text-red-500">{error}</p>
		{/if}

		{#if progress}
			<p class="text-green-500">{progress}</p>
		{/if}
	</form>
</div>
