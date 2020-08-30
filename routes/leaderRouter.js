/**
 * Router for /leaders and /leaders/:leaderId 
 */

const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	next()
})
.get((req, res, next) => {
	res.end('Will display all the leaders!');
})
.post((req, res, next) => {
	res.end(`Will add the leader ${req.body.name} (${req.body.description})!`);
})
.put((req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /leaders.');
})
.delete((req, res, next) => {
	res.end('Deleting all leaders!');
});

leaderRouter.route('/:leaderId')
.all((req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	next();
})
.get((req, res, next) => {
	res.end(`Will give the details of leader ${req.params.leaderId}.`);
})
.post((req, res, next) => {
	res.statusCode = 403;
	res.end(`POST operation not supported on /leaders/${req.params.leaderId}.`);
})
.put((req, res, next) => {
	res.write(`Updating the details of ${req.params.leaderId}...\n`);
	res.end(`Leader ${req.body.name} updated with "${req.body.description}"!`);
})
.delete((req, res, next) => {
	res.end(`Will delete leader ${req.params.leaderId}.`);
});

module.exports = leaderRouter;