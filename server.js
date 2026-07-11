require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const noteRoutes = require('./routes/noteRoutes');
const authRoutes = require('./routes/authRoutes');
const Note = require('./models/Note');

const app = express();
const DEFAULT_PORT = Number(process.env.PORT || 3000);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make req available in all views
app.use((req, res, next) => {
  res.locals.req = req;
  next();
});

// Routes
app.use('/', noteRoutes);
app.use('/', authRoutes);

// 404 Error Handler
app.use((req, res) => {
    res.status(404).render('404', { title: '404 - Page Not Found' });
});

// 500 Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { title: '500 - Server Error', error: err.message });
});

const startServer = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not set. Add your Atlas connection string to the .env file.');
    }

    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4
    });
    console.log('Connected to MongoDB Atlas');

    const listener = app.listen(DEFAULT_PORT, () => {
        console.log(`Server is running on http://localhost:${DEFAULT_PORT}`);
    });

    listener.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.warn(`Port ${DEFAULT_PORT} is busy. Trying ${DEFAULT_PORT + 1}...`);
            const fallbackListener = app.listen(DEFAULT_PORT + 1, () => {
                console.log(`Server is running on http://localhost:${DEFAULT_PORT + 1}`);
            });
            fallbackListener.on('error', (fallbackError) => {
                console.error('Failed to start server:', fallbackError.message);
                process.exit(1);
            });
            return;
        }
        console.error('Failed to start server:', error.message);
        process.exit(1);
    });
};

startServer().catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
});
