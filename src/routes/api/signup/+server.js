import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { json } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';

const pool = new Pool({
    connectionString: POSTGRES_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST({ request }) {
    const { email, password, user_name } = await request.json();
    const client = await pool.connect();

    try {
        // Check if user already exists
        const userExists = await client.query(
            'SELECT user_id FROM user_table WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return json({ error: 'Email already registered' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const result = await client.query(
            'INSERT INTO user_table (email, password, user_name) VALUES ($1, $2, $3) RETURNING user_id, email, user_name',
            [email, hashedPassword, user_name]
        );

        const user = result.rows[0];

        // Generate JWT
        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email,
                user_name: user.user_name
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return json({
            user_id: user.user_id,
            user_name: user.user_name,
            email: user.email,
            token
        });
    } catch (error) {
        console.error('Signup error:', error);
        return json({ error: 'An error occurred during signup' }, { status: 500 });
    } finally {
        client.release();
    }
}