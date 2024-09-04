import { OAuth2Client } from 'google-auth-library';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

export const getAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events' // Adjust scopes as needed
  ];
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
};

export const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

export const refreshAccessToken = async () => {
  const { credentials } = await oauth2Client.getAccessToken();
  oauth2Client.setCredentials(credentials);
  return credentials;
};