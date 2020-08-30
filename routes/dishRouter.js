const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	next();
})
.get((req, res, next) => {
	res.end('Will send all the dishes to you!');
})
.post((req, res, next) => {
	res.end(`Will add the dish: ${req.body.name} (${req.body.description})!`);
})
.put((req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /dishes.');
})
.delete((req, res, next) => {
	res.end('Deleting all the dishes for you!');
});

dishRouter.route('/:dishId')
.all((req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	next();
})
.get((req, res, next) => {
	res.end(`Will send the details of dish ${req.params.dishId}!`);
})
.post((req, res, next) => {
	res.statusCode = 403;
	res.end(`POST operation not supported on /dishes/${req.params.dishId}.`);
})
.put((req, res, next) => {
	res.write(`Updating dish ${req.params.dishId} for you.\n`);
	res.end(`Will update dish ${req.body.name} with "${req.body.description}".`);
})
.delete((req, res, next) => {
	res.end(`Deleting dish ${req.params.dishId} for you!`);
});

module.exports = dishRouter;