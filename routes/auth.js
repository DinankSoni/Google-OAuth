const express = require('express');
const router = express.Router();
const googleOAuth = require('../config/googleOAuth');
const User = require('../models/user');

// Step 1: Redirect user to Google
router.get('/google', (req, res) => {
    const url = googleOAuth.getGoogleAuthURL();
    res.redirect(url);
});

// Step 2: Handle the callback from Google
router.get('/google/callback', async (req, res) => {
    try {
        const { code } = req.query;

        // 1. Get tokens from Google
        const tokens = await googleOAuth.getTokens(code);

        // 2. Get user profile from Google
        const googleUser = await googleOAuth.getGoogleUserProfile(tokens.access_token);

        // 3. Store or update user in DB
        let user = await User.findOne({ googleId: googleUser.id });
        if (!user) {
            user = await User.create({
                name: googleUser.name,
                email: googleUser.email,
                googleId: googleUser.id
            });
        }

        // 4. Optional: Return a JWT token
        // const token = jwt.sign({ userId: user._id }, 'SECRET', { expiresIn: '1h' });

        res.json({
            message: 'Google login successful!',
            user
            // token
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Authentication failed' });
    }
});

// Step 3: Get All Users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-__v, -googleId');
        res.status(200).json({
          count: users.length,
          users
      });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

module.exports = router;
