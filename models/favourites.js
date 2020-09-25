const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	dishes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Dish'
		}
	]
});

module.exports = new mongoose.model('Favourite', favouriteSchema);