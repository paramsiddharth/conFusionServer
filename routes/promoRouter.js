/**
 * Router for /promotions and /promotions/:promoId 
 */

const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	next();
})
.get((req, res, next) => {
	res.end(`Will show you all promotions!`);
})
.post((req, res, next) => {
	res.end(`Will create promotion ${req.body.name} (${req.body.description}).`);
})
.put((req, res, next) => {
	res.statusCode = 403;
	res.end(`PUT operation not allowed on /promotions.`);
})
.delete((req, res, next) => {
	res.end(`Will delete all promotions!`);
});

promoRouter.route('/:promoId')
.all((req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	next();
})
.get((req, res, next) => {
	res.end(`Will give details of promotion ${req.params.promoId}.`);
})
.post((req, res, next) => {
	res.statusCode = 403;
	res.end(`POST operation not allowed on /promotions.`);
})
.put((req, res, next) => {
	res.end(`Updating ${req.params.promoId}...
Will update ${req.body.name} with "${req.body.description}".`);
})
.delete((req, res, next) => {
	res.end(`Will delete promotion ${req.params.promoId}.`);
});

module.exports = promoRouter;