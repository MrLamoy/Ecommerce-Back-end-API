const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema ({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: [true, 'userId is Required']
	},

	cartItems: [{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: [true, 'productId is Required']
		},

		quantity: {
			type: Number,
			required: [true, 'quantity is Required']
		},

		subtotal: {
			type: Number,
			required: [true, 'subtotal is Required']
		}
	}],

	totalPrice: {
		type: Number,
		required: [true, 'totalPrice is Required']
	},

	OrderedOn: {
		type: Date,
	   default: Date.now
	}

});

module.exports = mongoose.model("Cart", cartSchema);