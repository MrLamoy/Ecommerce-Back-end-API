const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

	name: {
		type: String,
		required: [true, 'Product name is Required']
	},
	description: {
		type: String,
		required: [true, 'Description is Required']
	},
	price: {
		type: Number,
		required: [true, 'Product price is Required']
	},
	isActive: {
		type: Boolean,
		default: true
	},
	createdOn: {
    	type: Date,
    	default: Date.now,
  },

});


module.exports = mongoose.model('Product', productSchema);