const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favourites = require('../models/favourites');

const favouriteRouter = express.Router();
favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
	Favourites.findOne({ user: req.user._id })
	.populate('user')
	.populate('dishes')
	.then((favourites) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(favourites);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.post(cors.cors, authenticate.verifyUser, (req, res, next) => {
	Favourites.findOne({ user: req.user._id })
	.then((favs) => {
		if (favs !== null) {
			for (let dish of req.body) {
				if (favs.dishes.indexOf((dish._id)) === -1)
					favs.dishes.push(dish._id);
			}
			favs.save()
			.then((favos) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(favos);
			}, (err) => next(err));
		} else {
			Favourites.create({
				user: req.user._id,
				dishes: []
			})
			.then((favos) => {
				for (let dish of req.body)
					favos.dishes.push(dish._id);
				favos.save()
				.then((favourites) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(favourites);
				}, (err) => next(err));
			})
		}
	}, (err) => next(err))
	.catch((err) => next(err));
})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /favourites.');
})
.delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
	Favourites.findOneAndDelete({ user: req.user._id })
	.then((favs) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(favs);
	}, (err) => next(err))
	.catch((err) => next(err));
});

favouriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
	res.statusCode = 403;
	res.end(`GET operation not supported on /favourites/${req.params.dishId}.`);
})
.post(cors.cors, authenticate.verifyUser, (req, res, next) => {
	Favourites.findOne({ user: req.user._id })
	.then((favs) => {
		if (favs !== null) {
			if (favs.dishes.indexOf(req.params.dishId) === -1)
				favs.dishes.push(req.params.dishId);
			favs.save()
			.then((favos) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(favos);
			}, (err) => next(err));
		} else {
			Favourites.create({
				user: req.user._id,
				dishes: []
			})
			.then((favos) => {
				favos.dishes.push(req.params.dishId);
				favos.save()
				.then((favourites) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(favourites);
				}, (err) => next(err));
			})
		}
	}, (err) => next(err))
	.catch((err) => next(err));
})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => {
	res.statusCode = 403;
	res.end(`PUT operation not supported on /favourites/${req.params.dishId}.`);
})
.delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
	Favourites.findOne({ user: req.user._id })
	.then((favs) => {
		favs.dishes.pull(req.params.dishId);
		favs.save()
		.then((resp) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(resp);
		});
	}, (err) => next(err))
	.catch((err) => next(err));
});

module.exports = favouriteRouter;