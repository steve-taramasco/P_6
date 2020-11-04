const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const secret_token = process.env.TOKEN;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, secret_token);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch(error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !'});
    }
};