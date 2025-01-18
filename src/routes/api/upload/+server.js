import { json } from '@sveltejs/kit';
import sharp from 'sharp';
import { Octokit } from '@octokit/rest';
import { ACCESS_TOKEN, POSTGRES_URL } from '$env/static/private';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
	connectionString: POSTGRES_URL
});

const octokit = new Octokit({
	auth: ACCESS_TOKEN
});

// Process images sequentially instead of concurrently
async function processAndUploadImage(imageBuffer, size, format, userId, timestamp) {
	try {
		const resizedImage = await sharp(imageBuffer)
			.resize(size, size, { fit: 'inside' })
			.toFormat(format)
			.toBuffer();

		const path = `${userId}/${timestamp}/image_${size}.${format}`;

		await octokit.repos.createOrUpdateFileContents({
			owner: 'ifsvivek01',
			repo: 'CDN',
			path,
			message: `Upload ${path}`,
			content: resizedImage.toString('base64'),
			branch: 'main'
		});

		return true;
	} catch (error) {
		console.error(`Error processing image size ${size}:`, error);
		return false;
	}
}

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const image = formData.get('image');
		const format = formData.get('format');
		const userId = formData.get('userId');

		console.log('Received userId:', userId); // Debug log

		if (!image || !format || !userId) {
			return json(
				{
					error: `Missing required fields. Image: ${!!image}, Format: ${!!format}, UserId: ${!!userId}`
				},
				{ status: 400 }
			);
		}

		if (userId === 'undefined' || !userId) {
			return json({ error: 'Invalid user ID' }, { status: 401 });
		}

		// Check file size (e.g., 10MB limit)
		const MAX_SIZE = 10 * 1024 * 1024;
		if (image.size > MAX_SIZE) {
			return json({ error: 'File too large' }, { status: 400 });
		}

		const imageBuffer = Buffer.from(await image.arrayBuffer());
		const timestamp = Math.floor(Date.now() / 1000);
		const sizes = [256, 512, 1024, 2048];
		const results = [];

		// Process images sequentially
		for (const size of sizes) {
			const success = await processAndUploadImage(imageBuffer, size, format, userId, timestamp);
			results.push(success);
		}

		// Check if all uploads were successful
		if (results.every((result) => result)) {
			await pool.query(
				'INSERT INTO user_images (user_id, foldername, format) VALUES ($1, $2, $3)',
				[userId, timestamp, format]
			);
			return json({
				success: true,
				urls: sizes.map(
					(size) => `https://cdn.ifsvivek.tech/${userId}/${timestamp}/image_${size}.${format}`
				)
			});
		} else {
			return json({ error: 'Some images failed to upload' }, { status: 500 });
		}
	} catch (error) {
		console.error('Upload error:', error);
		return json({ error: 'Upload failed' }, { status: 500 });
	}
}

export async function GET({ url }) {
	try {
		const userId = url.searchParams.get('userId');
		if (!userId) {
			return json({ error: 'User ID required' }, { status: 400 });
		}

		const result = await pool.query(
			'SELECT foldername, format FROM user_images WHERE user_id = $1 ORDER BY foldername DESC',
			[userId]
		);

		return json({ images: result.rows });
	} catch (error) {
		console.error('Error fetching images:', error);
		return json({ error: 'Failed to fetch images' }, { status: 500 });
	} finally {
	}
}

export async function DELETE({ request }) {
	try {
		const { userId, timestamp } = await request.json();

		// Get format from database first
		const result = await pool.query(
			'SELECT format FROM user_images WHERE user_id = $1 AND foldername = $2',
			[userId, timestamp]
		);

		if (result.rows.length === 0) {
			return json({ error: 'Image not found' }, { status: 404 });
		}

		const format = result.rows[0].format;
		const sizes = [256, 512, 1024, 2048];

		// Delete files sequentially
		for (const size of sizes) {
			const path = `${userId}/${timestamp}/image_${size}.${format}`;
			try {
				// Get file content first to obtain SHA
				const fileData = await octokit.repos.getContent({
					owner: 'ifsvivek01',
					repo: 'CDN',
					path
				});

				// Delete file using SHA
				await octokit.repos.deleteFile({
					owner: 'ifsvivek01',
					repo: 'CDN',
					path,
					message: `Delete ${path}`,
					sha: fileData.data.sha,
					branch: 'main'
				});

				console.log(`Successfully deleted ${path}`);
			} catch (error) {
				console.error(`Failed to delete ${path}:`, error);
			}
		}

		await pool.query('DELETE FROM user_images WHERE user_id = $1 AND foldername = $2', [
			userId,
			timestamp
		]);
	} catch (error) {
		console.error('Delete error:', error);
		return json({ error: 'Failed to delete image' }, { status: 500 });
	}
}
