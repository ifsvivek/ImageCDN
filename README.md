# ImageCDN

A modern image optimization and delivery service built with SvelteKit. Upload once, serve everywhere with automatic optimization and lightning-fast delivery.

## Features

### 🖼️ Smart Optimization

- Automatic image optimization and conversion
- Support for WebP, JPG, and PNG formats
- Multiple size variants generated automatically

### ⚡ High Performance

- Global CDN distribution
- Responsive image variants
- Fast loading times worldwide

### 🛠️ Easy Integration

- Simple upload interface
- Copy-paste URLs for different sizes
- Dashboard for managing images

### 🔒 Secure

- User authentication
- Protected image uploads
- Secure CDN delivery

## Tech Stack

- **Frontend**: SvelteKit, TailwindCSS
- **Backend**: Node.js, PostgreSQL (Neon)
- **Storage**: GitHub as CDN
- **Authentication**: JWT

## API Endpoints

The service provides RESTful API endpoints for:

- Image upload (`POST /api/upload`)
- Image retrieval (`GET /api/upload`)
- Image deletion (`DELETE /api/upload`)

## Usage Notes

After uploading images, please allow up to 20 minutes for processing and CDN availability. This ensures optimal compression and format conversion.
