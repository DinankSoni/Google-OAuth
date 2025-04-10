const axios = require('axios');
const qs = require('querystring');
const dotenv = require('dotenv');
dotenv.config();

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_PROFILE_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

exports.getGoogleAuthURL = () => {
    // Redirect user to Google's OAuth2 flow
    const params = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        access_type: 'offline',
        prompt: 'consent',
    };
    return `${GOOGLE_AUTH_URL}?${qs.stringify(params)}`;
};

exports.getTokens = async (code) => {
    // Get tokens from Google after user has authorized our app
    const { data } = await axios.post(GOOGLE_TOKEN_URL, qs.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    return data;
};

exports.getGoogleUserProfile = async (access_token) => {
    // Get user profile from Google
    const { data } = await axios.get(GOOGLE_PROFILE_URL, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    return data;
};

