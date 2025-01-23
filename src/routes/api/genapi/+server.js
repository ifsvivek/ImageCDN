import { json } from '@sveltejs/kit';
import { Pool } from '@neondatabase/serverless';
import { POSTGRES_URL } from '$env/static/private';
import crypto from 'crypto';

const pool = new Pool({
    connectionString: POSTGRES_URL
});

// Generate API key
function generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
}

// Create API key
export async function POST({ request }) {
    try {
        const { user_id } = await request.json();

        if (!user_id) {
            return json({ error: 'User ID required' }, { status: 400 });
        }

        const apiKey = generateApiKey();

        // Store API key in database
        await pool.query(
            'INSERT INTO api_keys (user_id, api_key) VALUES ($1, $2)',
            [user_id, apiKey]
        );

        return json({ apiKey });
    } catch (error) {
        console.error('Error creating API key:', error);
        return json({ error: 'Failed to create API key' }, { status: 500 });
    }
}

// Get user's API keys
export async function GET({ url }) {
    try {
        const userId = url.searchParams.get('userId');

        if (!userId) {
            return json({ error: 'User ID required' }, { status: 400 });
        }

        const result = await pool.query(
            'SELECT api_key, created_at FROM api_keys WHERE user_id = $1',
            [userId]
        );

        return json({ apiKeys: result.rows });
    } catch (error) {
        console.error('Error fetching API keys:', error);
        return json({ error: 'Failed to fetch API keys' }, { status: 500 });
    }
}

// Delete API key
export async function DELETE({ request }) {
    try {
        const { user_id, api_key } = await request.json();

        await pool.query(
            'DELETE FROM api_keys WHERE user_id = $1 AND api_key = $2',
            [user_id, api_key]
        );

        return json({ success: true });
    } catch (error) {
        console.error('Error deleting API key:', error);
        return json({ error: 'Failed to delete API key' }, { status: 500 });
    }
}