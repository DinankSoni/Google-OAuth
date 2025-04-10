const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express();
const authRoutes = require('./routes/auth');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

module.exports = app;
