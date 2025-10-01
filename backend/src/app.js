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

app.use(cors({
    origin: 'https://food-view-6oeoc9jgr-yadavgaya031s-projects.vercel.app/', // ✅ This should match your frontend port
    credentials: true
}));

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
