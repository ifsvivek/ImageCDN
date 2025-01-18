import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { json } from '@sveltejs/kit';
import { POSTGRES_URL, JWT_SECRET } from '$env/static/private';

const pool = new Pool({
	connectionString: POSTGRES_URL
});

export async function POST({ request }) {
	const { email, password } = await request.json();
	const client = await pool.connect();

	try {
		const result = await client.query(
			'SELECT user_id, user_name, email, password FROM user_table WHERE email = $1',
			[email]
		);

		if (result.rows.length === 0) {
			return json({ error: 'Invalid email or password' }, { status: 400 });
		}

		const user = result.rows[0];
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return json({ error: 'Invalid email or password' }, { status: 400 });
		}

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
		console.error('Login error:', error);
		return json({ error: 'An error occurred during login' }, { status: 500 });
	} finally {
		client.release();
	}
}
