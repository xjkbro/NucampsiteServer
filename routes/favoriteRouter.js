const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();

favoriteRouter
    .route("/")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate("user")
            .populate("campsites")
            .then((user) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(user);
            })
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id }).then((favorite) => {
            if (favorite) {
                req.body.forEach((campsite) => {
                    if (!favorite.campsites.includes(campsite._id)) {
                        favorite.campsites.push(campsite);
                    }
                });
                favorite
                    .save()
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "applications/json");
                        res.json(favorite);
                    })
                    .catch((err) => next(err));
            } else {
                console.log("else");
                Favorite.create({ user: req.user._id }).then((favorite) => {
                    console.log("favorite created", favorite);
                    if (favorite) {
                        req.body.forEach((campsite) => {
                            console.log(campsite);
                            if (!favorite.campsites.includes(campsite._id)) {
                                favorite.campsites.push(campsite);
                            }
                        });
                        favorite
                            .save()
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader();
                                res.json(favorite);
                            })
                            .catch((err) => next(err));
                    }
                });
            }
        });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /favorite");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(response);
                } else {
                    res.setHeader("Content-Type", "text/plain");
                    res.end("You do not have any favorites to delete");
                }
            })
            .catch((err) => next(err));
    });

favoriteRouter
    .route("/:campsiteId")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end("GET operation not supported on /favorite/:campsiteId");
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        Favorite.findOne({ user: req.user._id }).then((favorite) => {
            console.log(favorite);
            if (favorite) {
                if (!favorite.campsites.includes(req.params.campsiteId)) {
                    favorite.campsites.push(req.params.campsiteId);
                    favorite
                        .save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "applications/json");
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                } else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.end(
                        "That campsite is already in the list of favorites"
                    );
                }
            } else {
                Favorite.create({
                    user: req.user._id,
                    campsites: [req.params.campsiteId],
                })
                    .then((favorite) => {
                        res.statusCode(200);
                        res.setHeader("Content-Type", "application/json");
                        res.json(favorite);
                    })
                    .catch((err) => next(err));
            }
        });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /favorite/:campsiteId");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    let i = favorite.campsites.indexOf(req.params.campsiteId);
                    if (i >= 0) {
                        favorite.campsites.splice(i, 1);
                    }
                    favorite.save().then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(favorite);
                    });
                } else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                }
            })
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;
