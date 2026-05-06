# X-uitter Frontend

[🇧🇷 Versão em Português](./README.pt-BR.md)

## 🌐 Description

**X-uitter Frontend** is the Vue.js web client for the X-uitter MVP, a Twitter/X-inspired social network project.

This application consumes the **X-uitter API** and provides a user interface for authentication, viewing the personalized feed, creating xweets, interacting with posts, and exploring user profile/social features.

The project was built as a frontend proof of concept for the existing backend MVP, using a simple and maintainable structure organized into **components**, **pages**, **composables**, **router**, **services**, **config**, and **utils**.

### Project links

| Resource | Link |
|---|---|
| Frontend Repository | [GitHub](https://github.com/jfan-dev/X-witter-4-growdev-front) |
| Frontend Deployment | [Vercel](https://x-witter-4-growdev-front.vercel.app/) |
| Backend Repository | [GitHub](https://github.com/jfan-dev/X-witter-4-growdev) |
| Backend Deployment | [Vercel](https://x-witter-4-growdev.vercel.app/) |
| Backend Swagger Docs | [Swagger](https://x-witter-4-growdev.vercel.app/docs) |

## 🌐 Prerequisites to run the project

- Frontend: **Vue.js 3 + TypeScript**
- Build tool: **Vite**
- Routing: **Vue Router**
- Package manager: **npm**
- Backend API: **X-uitter API running locally or deployed**
- Recommended environment: **Ubuntu 22.04 or higher**

### Cloning the repository

```bash
> git clone https://github.com/jfan-dev/X-witter-4-growdev-front.git
> cd X-witter-4-growdev-front
```

> If your frontend repository URL is different, replace the clone URL above with the correct one.

### Installing dependencies

```bash
> npm install
```

### Configuring environment variables

Create a `.env` file in the project root:

```bash
> touch .env
```

Configuration example for local development:

```env
VITE_API_URL=http://localhost:3002
```

Configuration example for production:

```env
VITE_API_URL=https://x-witter-4-growdev.vercel.app
```

> Do not add a trailing slash to `VITE_API_URL`. Use `https://example.com`, not `https://example.com/`, because the frontend API service already appends route paths such as `/auth/signin`.

> Never commit the `.env` file to GitHub. Keep only a versioned `.env.example` file.

### Running the Frontend

```bash
# Start the development server
> npm run dev
```

After starting the server, Vite will show the local URL in the terminal, usually:

```bash
http://localhost:5173
```

### Building for production

```bash
> npm run build
```

This command runs TypeScript checks with `vue-tsc` and then generates the production build with Vite.

### Previewing the production build locally

```bash
> npm run preview
```

Use this command after `npm run build` to test the production build locally.

## 🧱 Project Structure

```bash
X-UITTER-FRONT/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── config/
│   ├── pages/
│   ├── router/
│   ├── services/
│   ├── utils/
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── .env.example
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── README.pt-BR.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### Main folders

| Folder | Responsibility |
|---|---|
| `src/assets` | Static assets used by the frontend. |
| `src/components` | Reusable Vue components such as layout, cards, forms, and profile/feed UI. |
| `src/composables` | Reusable Vue Composition API logic, such as authentication state. |
| `src/config` | Application configuration, links, and environment-based constants. |
| `src/pages` | Route-level pages rendered by Vue Router. |
| `src/router` | Frontend route definitions and navigation configuration. |
| `src/services` | API communication layer and backend request helpers. |
| `src/utils` | Shared helper functions. |

## ✍🏻️ Features

| 🔐 Authentication | 📰 Personalized feed | 🐦 Xweet creation |
| --- | --- | --- |
| Users can sign up, sign in, keep a local session token, and log out. | The app consumes the backend feed endpoint to show the user's own xweets and posts from followed users. | Authenticated users can publish new xweets from the frontend interface. |

| 👤 Profile area | 🤝 Social interactions | 🌐 Deployment-ready setup |
| --- | --- | --- |
| The UI includes profile-related areas and authenticated user information. | The frontend is prepared to consume backend features such as likes, replies, follow, and unfollow. | The project uses Vite environment variables and can be deployed on Vercel. |

## ✍🏻️ Resources and Technologies Used

| Technology | Usage | Website |
|---|---|---|
| Vue.js | Frontend framework used to build the user interface | [Link](https://vuejs.org/) |
| TypeScript | Static typing for safer and clearer frontend code | [Link](https://www.typescriptlang.org/) |
| Vite | Development server and production build tool | [Link](https://vite.dev/) |
| Vue Router | Client-side routing for Vue pages | [Link](https://router.vuejs.org/) |
| npm | Package manager used to install dependencies and run scripts | [Link](https://www.npmjs.com/) |
| Vercel | Frontend deployment platform | [Link](https://vercel.com/) |
| GitHub | Version control and public repository hosting | [Link](https://github.com/) |

## 🔗 Backend API Integration

This frontend consumes the **X-uitter API**.

Local backend:

```bash
http://localhost:3002
```

Production backend:

```bash
https://x-witter-4-growdev.vercel.app
```

Backend Swagger documentation:

```bash
https://x-witter-4-growdev.vercel.app/docs
```

The frontend API service reads the base URL from:

```env
VITE_API_URL
```

It sends JSON requests and, when a token exists in `localStorage`, attaches the authorization header automatically:

```bash
Authorization: Bearer YOUR_TOKEN_HERE
```

### Main backend routes consumed

| Method | Route | Usage in frontend |
|---|---|---|
| POST | `/auth/signup` | Create a new account |
| POST | `/auth/signin` | Log in and receive JWT token |
| GET | `/feed` | Load authenticated user's feed |
| POST | `/xweets` | Create a new xweet |
| POST | `/xweets/:id/reply` | Reply to a xweet |
| POST | `/xweets/:id/like` | Like a xweet |
| DELETE | `/xweets/:id/like` | Remove a like |
| GET | `/users/:id` | Load a user profile |
| POST | `/users/:id/follow` | Follow a user |
| DELETE | `/users/:id/follow` | Unfollow a user |

> All private routes require a valid Bearer Token. Only signup and signin are public.

## 🔐 Authentication Flow

1. The user creates an account or signs in.
2. The backend returns a JWT token.
3. The frontend stores the token locally.
4. API requests read the stored token.
5. Protected backend routes receive the token through the `Authorization` header.
6. When the user logs out, the local session is cleared and the user is redirected to the auth page.

## 🛠 Challenges and Solutions

### CORS and duplicated slashes in API URLs

- During deployment, requests with a duplicated slash between the backend URL and route path can cause redirect problems in browser preflight requests.
- The solution is to keep `VITE_API_URL` without a trailing slash and let the frontend API service append route paths normally.

Correct:

```env
VITE_API_URL=https://x-witter-4-growdev.vercel.app
```

Avoid:

```env
VITE_API_URL=https://x-witter-4-growdev.vercel.app/
```

### Separating frontend and backend deployments

- The frontend and backend are deployed as separate applications.
- The solution is to configure the frontend deployment with the production backend URL using `VITE_API_URL`.

### Keeping environment files safe

- The `.env` file stores environment-specific configuration and should not be committed.
- The solution is to commit `.env.example` and configure the real variables locally and in Vercel.

### Vercel SPA Route Refresh Fix

This project uses Vue Router to manage frontend routes such as:

```txt
/app
/profile
/explore
```

These routes work normally when navigating inside the application. However, when refreshing the page directly on one of these routes in production, Vercel may return:

```txt
404: NOT_FOUND
Code: NOT_FOUND
```

This happens because the frontend is a Single Page Application. The route `/app` exists only inside Vue Router, not as a real file or server route on Vercel. When the browser refreshes the page, Vercel tries to load `/app` directly from the server and cannot find it.

To solve this, the project uses a `vercel.json` file in the frontend root folder:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This configuration redirects all frontend requests back to `index.html`, allowing Vue Router to handle the correct page after the application loads.

After adding this file, refreshes on frontend routes work correctly in production.

## 🚀 Deployment

The frontend can be deployed on **Vercel**.

### Vercel configuration

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### Required environment variable

```env
VITE_API_URL=https://x-witter-4-growdev.vercel.app
```

### Deployment checklist

- [ ] Confirm the backend API is deployed and responding
- [ ] Configure `VITE_API_URL` in Vercel
- [ ] Run `npm run build` locally before deploying
- [ ] Import the frontend repository into Vercel
- [ ] Deploy the frontend
- [ ] Test signup in production
- [ ] Test signin in production
- [ ] Test authenticated requests in production
- [ ] Add the frontend deployment link to this README

## ✅ POC / MVP Status

| Feature | Status |
|---|---|
| Vue + TypeScript setup | ✅ Implemented |
| Vite development setup | ✅ Implemented |
| Vue Router structure | ✅ Implemented |
| API service with environment base URL | ✅ Implemented |
| Token-based request headers | ✅ Implemented |
| Authentication UI flow | ✅ Implemented |
| Feed UI flow | ✅ Implemented |
| Create xweet flow | ✅ Implemented |
| Profile/follow area | ✅ Implemented |
| Production build command | ✅ Implemented |
| Vercel deployment | ✅ Implemented |

## 🧾 Useful scripts

```bash
# Run local development server
> npm run dev

# Type-check and build for production
> npm run build

# Preview production build locally
> npm run preview
```

## 🐼 Developed by

**Jaime Fernandes**  
📧 jfernan10@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/jfan-dev)  
🐙 [GitHub](https://github.com/jfan-dev)
