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

// Validate API key
async function validateApiKey(apiKey) {
    try {
        const result = await pool.query(
            'SELECT user_id FROM api_keys WHERE api_key = $1',
            [apiKey]
        );
        return result.rows[0]?.user_id;
    } catch (error) {
        console.error('API key validation error:', error);
        return null;
    }
}

async function uploadImage(user_id, imageBuffer, format) {
    try {
        const optimizedImage = await sharp(imageBuffer)
            .resize(1024, 1024, { fit: 'inside' })
            .toFormat(format)
            .toBuffer();

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `${user_id}/${timestamp}.${format}`;

        await octokit.repos.createOrUpdateFileContents({
            owner: 'ifsvivek01',
            repo: 'CDN',
            path,
            message: `Upload ${path}`,
            content: optimizedImage.toString('base64'),
            branch: 'main'
        });

        return `https://cdn.ifsvivek.tech/${path}`;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}

export async function POST({ request }) {
    try {
        const formData = await request.formData();
        const image = formData.get('image');
        const format = formData.get('format') || 'webp';
        const apiKey = formData.get('apiKey');

        // Validate API key
        if (!apiKey) {
            return json({ error: 'API key required' }, { status: 401 });
        }

        const userId = await validateApiKey(apiKey);
        if (!userId) {
            return json({ error: 'Invalid API key' }, { status: 401 });
        }

        // Validate image
        if (!image) {
            return json({ error: 'No image provided' }, { status: 400 });
        }

        // Check file size (10MB limit)
        const MAX_SIZE = 10 * 1024 * 1024;
        if (image.size > MAX_SIZE) {
            return json({ error: 'File too large (max 10MB)' }, { status: 400 });
        }

        const imageBuffer = Buffer.from(await image.arrayBuffer());
        const url = await uploadImage(userId, imageBuffer, format);

        // Track usage (optional)
        await pool.query(
            'INSERT INTO api_usage (user_id, api_key) VALUES ($1, $2)',
            [userId, apiKey]
        );

        return json({ url });
    } catch (error) {
        console.error('Upload error:', error);
        return json({ error: 'Upload failed' }, { status: 500 });
    }
}