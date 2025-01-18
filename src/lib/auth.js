export async function login(email, password) {
	const response = await fetch('/api/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, password })
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.error || 'Login failed');
	}

	return data;
}

export async function signup(email, password, user_name) {
	const response = await fetch('/api/signup', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, password, user_name })
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.error || 'Signup failed');
	}

	return data;
}
