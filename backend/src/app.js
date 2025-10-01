// create server
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');
const foodRoutes = require('./routes/food.route');
const foodPartnerRoutes = require('./routes/food-partner.route');
const cors = require('cors');
const orderRoutes = require('./routes/orders.route');

const app = express();

app.use(express.json());
app.use(cookieParser());


// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:5173', // Development frontend
            'https://food-view-6oeoc9jgr-yadavgaya031s-projects.vercel.app', // Previous deployment
            'https://food-view-okvdj56kj-yadavgaya031s-projects.vercel.app', // Current deployment
        ];
        
        // Check if origin matches any allowed origins or matches the Vercel pattern
        if (allowedOrigins.includes(origin) || /^https:\/\/food-view-.*\.vercel\.app$/.test(origin)) {
            console.log('CORS: Allowing origin:', origin);
            callback(null, true);
        } else {
            console.log('CORS: Blocking origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options(cors(corsOptions));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
    next();
});

// define routes

// console.log(process.env.MONGODB_URI);

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);
app.use('/api/orders', orderRoutes);

module.exports = app;
