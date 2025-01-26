# ImageCDN

A modern image optimization and delivery service built with SvelteKit. Upload once, serve everywhere with automatic optimization and lightning-fast delivery.

---

## Features

### 🔽 Smart Optimization

- Automatic image optimization and format conversion
- Supports WebP, JPG, and PNG formats
- Generates multiple size variants automatically

### ⚡ High Performance

- Global CDN distribution
- Responsive image variants for all devices
- Lightning-fast loading times worldwide

### 🛠️ Easy Integration

- Simple and intuitive upload interface
- Copy-paste URLs for different sizes
- Dashboard for managing images

### 🔒 Secure

- User authentication for access control
- Protected image uploads
- Secure CDN delivery with encrypted endpoints

---

## Tech Stack

- **Frontend**: SvelteKit, TailwindCSS
- **Backend**: Node.js, PostgreSQL (Neon)
- **Storage**: GitHub as CDN
- **Authentication**: JWT

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/ifsvivek/ImageCDN
cd ImageCDN
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
ACCESS_TOKEN="your_github_personal_access_token"
POSTGRES_URL="your_neon_postgres_connection_string"
JWT_SECRET="your_random_secret_key"
```

---

## Configuration

### GitHub Setup

1. Create a new repository named `CDN` in your GitHub account.
2. Generate a personal access token with `repo` permissions.
3. Update the following lines in [`src/routes/api/upload/+server.js`](./src/routes/api/upload/+server.js) with your GitHub username:

   ```js
   await octokit.repos.createOrUpdateFileContents({
   	owner: 'your-github-username',
   	repo: 'CDN',
   	path,
   	message: `Upload ${path}`,
   	content: resizedImage.toString('base64'),
   	branch: 'main'
   });

   const fileData = await octokit.repos.getContent({
   	owner: 'your-github-username',
   	repo: 'CDN',
   	path
   });

   await octokit.repos.deleteFile({
   	owner: 'your-github-username',
   	repo: 'CDN',
   	path,
   	message: `Delete ${path}`,
   	sha: fileData.data.sha,
   	branch: 'main'
   });

   return json({
   	success: true,
   	urls: sizes.map(
   		(size) =>
   			`https://cdn.your-github-username.io/${userId}/${timestamp}/image_${size}.${format}`
   	)
   });
   ```

### Database Setup

1. Create a free database on [Neon](https://neon.tech).
2. Execute the following SQL commands to create the required tables:

   ```sql
   CREATE TABLE user_table (
       user_id SERIAL PRIMARY KEY,
       email VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       user_name VARCHAR(255) NOT NULL
   );

   CREATE TABLE user_images (
       id SERIAL PRIMARY KEY,
       user_id INTEGER REFERENCES user_table(user_id),
       foldername VARCHAR(255) NOT NULL,
       format VARCHAR(10) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE api_keys (
       id SERIAL PRIMARY KEY,
       user_id INTEGER REFERENCES user_table(user_id),
       api_key VARCHAR(255) UNIQUE NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE api_usage (
       id SERIAL PRIMARY KEY,
       user_id INTEGER REFERENCES user_table(user_id),
       api_key VARCHAR(255) REFERENCES api_keys(api_key),
       used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

---

## Development

Start the development server:

```bash
npm run dev
```

## Building for Production

Build the project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Usage Notes

After uploading images, please allow up to **20 minutes** for processing and CDN availability. This ensures optimal compression and format conversion.

---

## Environment Variables

- `ACCESS_TOKEN`: GitHub personal access token with `repo` permissions
- `POSTGRES_URL`: Neon PostgreSQL connection string
- `JWT_SECRET`: Random string used for JWT token generation

---

## CDN URLs

Images will be available at:

```
https://cdn.yourdomain.com/{user_id}/{timestamp}/image_{size}.{format}
```

Where:

- `size`: 256, 512, 1024, or 2048
- `format`: webp, jpg, or png

---

## Contributing

1. Fork the repository.
2. Create a new feature branch.
3. Make your changes.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
