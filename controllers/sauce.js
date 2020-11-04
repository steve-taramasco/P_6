const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    const user = req.body.userId;
    const sauceId = req.params.id;

    Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
        
        if (like === 1) {

            Sauce.updateOne({ _id: sauceId }, { 
                $inc: { likes: 1 },
                $push: { usersLiked: user }
            })
            .then(() => res.status(200).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }));
        } else if (like === -1) {

            Sauce.updateOne({ _id: sauceId }, {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: user }
            })
            .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
            .catch(error => res.status(400).json({ error }));

        } else {
            if (sauce.usersLiked.includes(user)) {

                Sauce.updateOne({ _id: sauceId}, {
                    $pull: { usersLiked: user },
                    $inc: { likes: -1 }
                })
                .then(() => {res.status(200).json({ message: 'Like retiré !'})})
                .catch(error => res.status(400).json({ error }));
            } else {

                Sauce.updateOne({ _id: sauceId }, {
                    $pull: { usersDisliked: user },
                    $inc: { dislikes: -1 }
                })
                .then(() => {res.status(200).json({ message: 'Dislike retiré!'})})
                .catch(error => res.status(400).json({ error }));
            }
        } 
    })
    .catch(error => res.status(404).json({ error }));
};

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({  _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};
  