const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const dotenv = require('dotenv').config();
const mongoSanitize = require('express-mongo-sanitize');
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const app = express();

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.3o8di.mongodb.net/sopekocko?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Referer, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet());
app.use(bodyParser.json());
app.use(mongoSanitize());
app.use('/images', express.static(path.join(__dirname,'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;