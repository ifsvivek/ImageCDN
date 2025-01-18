<script>
	import { user } from '$lib/stores/user';
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl px-4 py-12">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold tracking-tight text-gray-900">Welcome to ImageCDN</h1>
			<p class="text-lg text-gray-600">Your personal image optimization and hosting solution</p>
		</div>

		<!-- Features Section -->
		<div class="mx-auto mb-12 max-w-3xl">
			<div class="grid gap-6 md:grid-cols-2">
				<div class="rounded-lg bg-white p-6 shadow">
					<h2 class="mb-3 text-xl font-semibold text-gray-900">Image Optimization</h2>
					<p class="text-gray-600">
						Automatically optimize your images and convert them to WebP, JPG, or PNG formats for
						better performance.
					</p>
				</div>
				<div class="rounded-lg bg-white p-6 shadow">
					<h2 class="mb-3 text-xl font-semibold text-gray-900">Multiple Sizes</h2>
					<p class="text-gray-600">
						Each image is automatically resized to 256px, 512px, 1024px, and 2048px variants.
					</p>
				</div>
			</div>
		</div>

		<!-- Note About Activation Time -->
		<div class="mx-auto mb-12 max-w-3xl">
			<div class="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
				<p class="flex items-center">
					<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
							clip-rule="evenodd"
						/>
					</svg>
					Important: After uploading, images may take up to 20 minutes to become active and accessible
					through the CDN.
				</p>
			</div>
		</div>

		<div class="mx-auto max-w-2xl">
			<div class="overflow-hidden rounded-2xl bg-white p-8 shadow">
				{#if $user}
					<div class="text-center">
						<p class="mb-6 text-xl text-gray-700">Welcome back, {$user.user_name}!</p>
						<a
							href="/dashboard"
							class="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
						>
							Go to Dashboard
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="ml-2 h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					</div>
				{:else}
					<div class="text-center">
						<p class="mb-6 text-xl text-gray-700">Please log in or sign up to continue</p>
						<div class="flex justify-center space-x-4">
							<a
								href="/login"
								class="inline-flex items-center rounded-lg bg-gray-100 px-6 py-3 text-base font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
							>
								Login
							</a>
							<a
								href="/signup"
								class="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
							>
								Sign Up
							</a>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
