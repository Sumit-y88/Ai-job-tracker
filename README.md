# JobTrackr

## Google OAuth Setup

To enable Google sign-in functionality, you must configure a Google Cloud project and obtain OAuth 2.0 credentials.

1. Go to the [Google Cloud Console](https://console.cloud.google.com).
2. Create a new project (or select an existing one).
3. Go to **APIs & Services** -> **OAuth consent screen**
   - User type: External
   - App name: JobTrackr
   - Add scopes: `email`, `profile`, `openid`
4. Go to **APIs & Services** -> **Credentials**
   - Click "Create Credentials" -> **OAuth 2.0 Client ID**
   - Application type: Web application
   - Authorized JavaScript origins:
       - `http://localhost:5173`
       - `https://your-production-domain.com`
   - Authorized redirect URIs:
       - `http://localhost:5000/api/auth/google/callback`
       - `https://your-production-api.com/api/auth/google/callback`
5. Copy the generated **Client ID** and **Client Secret**.
6. Paste them into the `backend/.env` file:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```
