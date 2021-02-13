const express = require("express");
const promotionRouter = express.Router();

promotionRouter
    .route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res) => {
        res.end("Will send all the promotions to you");
    })
    .post((req, res) => {
        res.end(
            `Will add the promotion: ${req.body.name} with description: ${req.body.description}`
        );
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /promotions");
    })
    .delete((req, res) => {
        res.end("Deleting all promotions");
    });
promotionRouter
    .route("/:promotionId")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res) => {
        const { promotionId } = req.params;
        res.end(
            "Will send details of the promotion " + promotionId + " to you"
        );
    })
    .post((req, res) => {
        res.statusCode = 403;
        const { promotionId } = req.params;
        res.end("POST operation not supported on /promotions/" + promotionId);
    })
    .put((req, res) => {
        const { promotionId } = req.params;
        res.end(
            `Updating the promotion: ${promotionId} \n   Will add the promotion: ${req.body.name} with description: ${req.body.description}`
        );
    })
    .delete((req, res) => {
        const { promotionId } = req.params;
        res.end("Deleting promotion: " + promotionId);
    });

module.exports = promotionRouter;
