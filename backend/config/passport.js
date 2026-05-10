import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

// GOOGLE CLOUD CONSOLE SETUP INSTRUCTIONS
// 1. Go to https://console.cloud.google.com
// 2. Create a new project (or select existing)
// 3. Go to APIs & Services -> OAuth consent screen
//    - User type: External
//    - App name: JobTrackr
//    - Add scopes: email, profile, openid
// 4. Go to APIs & Services -> Credentials
//    - Click "Create Credentials" -> OAuth 2.0 Client ID
//    - Application type: Web application
//    - Authorized JavaScript origins:
//        http://localhost:5173
//        https://your-production-domain.com
//    - Authorized redirect URIs:
//        http://localhost:5000/api/auth/google/callback
//        https://your-production-api.com/api/auth/google/callback
// 5. Copy Client ID and Client Secret into .env

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if a user exists with googleId === profile.id
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) {
          return done(new Error('No email found from Google profile'), null);
        }

        // 2. Check if a user exists with email === profile.emails[0].value
        user = await User.findOne({ email });

        if (user) {
          if (user.authProvider === 'local') {
            return done(
              new Error('Account with this email already exists, please sign in with email and password'),
              null
            );
          }

          if (user.authProvider === 'google') {
            // Update googleId if missing
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          }
        }

        // 3. Neither exists -> create new user
        const newUser = await User.create({
          name: profile.displayName,
          email: email,
          googleId: profile.id,
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
          authProvider: 'google',
          resumeText: '',
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Do NOT use passport sessions (stateless JWT app)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
