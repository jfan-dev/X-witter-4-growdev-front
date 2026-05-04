# X-uitter Front

Simple Vue.js proof-of-concept frontend created to consume and validate the X-uitter API MVP.

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Native Fetch API

## Requirements

- Node.js
- npm
- X-uitter API running locally

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3002

```
## Deployment

This frontend is deployed with Vercel.

For production, configure the following environment variable in the Vercel project settings:

```env
VITE_API_URL=https://x-witter-4-growdev.vercel.app

```