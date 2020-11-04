const saltedsha256 = require('salted-sha256');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const secret_token = process.env.TOKEN;
const salt = process.env.SALT;

exports.signup = (req, res, next) => {
    const email_valid = /^[\w._-]+@[\w._-]+\.[a-z]{2,6}$/i;
    if (!email_valid.test(req.body.email)) {
        return res.status(400).json({ error: 'Email non valide...' });
    }
    saltedsha256(req.body.email, salt, true)
    .then((email_hash) => {
        saltedsha256(req.body.password, salt, true)
        .then((pass_hash) => {
            const user = new User({
                email: email_hash,
                password: pass_hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
   saltedsha256(req.body.email, salt, true)
   .then((email_hash) => {
        User.findOne({ email: email_hash })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: 'Email inconnu !' });
            }
            saltedsha256(req.body.password, salt, true)
            .then((pass_hash) => {
                if (user.password !== pass_hash) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign({ userId: user._id }, secret_token, { expiresIn: '24h' })
                })
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};