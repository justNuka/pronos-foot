const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const predictionsRoutes = require('./routes/predictions');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');
const app = express();
const PORT = 3000;

// CORS configuration
const corsOptions = {
    origin: 'http://localhost', // Autoriser votre frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Définir sur true en production
        httpOnly: true,
        sameSite: 'strict'
    }
}));

app.use('/api/predictions', predictionsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

// Preflight all routes
app.options('*', cors(corsOptions));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});