const Cart = require("../models/Cart");
const Product = require("../models/Product");




// module.exports.getUserCart = async (req, res) => {
//   try {
//     const userId = req.body.userId;

//     // Find the user's cart by user ID
//     const cart = await Cart.findOne({ userId: userId }).populate('cartItems.productId');

//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found for the user' });
//     }

//     res.json(cart);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

module.exports.getUserCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Fetching cart for user ID:', userId);

    const cart = await Cart.findOne({ userId: userId }).populate('cartItems.productId');

    if (!cart) {
      console.log('Cart not found for user ID:', userId);
      return res.status(404).json({ message: 'Cart not found for the user' });
    }

    console.log('Cart found:', cart);
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




module.exports.addToCart = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { productId, quantity } = req.body;

    // Validate if productId is provided
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'ProductId and quantity are required' });
    }

    // Find the user's cart by user ID
    let cart = await Cart.findOne({ userId: userId });

    // If the user doesn't have a cart, create a new one
    if (!cart) {
      cart = new Cart({ userId: userId, cartItems: [] });
    }

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate subtotal
    const subtotal = product.price * quantity;

    // Check if the product is already in the cart
    const existingItem = cart.cartItems.find(item => item.productId.equals(productId));

    if (existingItem) {
      // If the product is already in the cart, update the quantity and subtotal
      existingItem.quantity += quantity;
      existingItem.subtotal += subtotal;
    } else {
      // If the product is not in the cart, add a new item
      cart.cartItems.push({ productId: productId, quantity: quantity, subtotal: subtotal });
    }

    // Update the total price for all items
    cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

    // Save the cart
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



module.exports.udpateQuantity = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'ProductId and quantity are required' });
    }

    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for the user' });
    }

    // Log the current state of the cart for debugging
    console.log('Current Cart:', cart);

    // Find the cart item by productId
    const cartItem = cart.cartItems.find(item => item.productId == productId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Product not found in the cart' });
    }

    // Find the product by ID to get the price
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the quantity of the cart item
    cartItem.quantity = quantity;

    // Update the subtotal and total price
    cartItem.subtotal = product.price * quantity;
    cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

    // Save the updated cart
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


module.exports.removeFromCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { userId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'ProductId is required' });
    }

    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      console.log('Cart not found for the user:', userId);
      return res.status(404).json({ message: 'Cart not found for the user' });
    }

    // Log the current state of the cart for debugging
    console.log('Current Cart:', cart);

    // Find the index of the cart item by productId
    const cartItemIndex = cart.cartItems.findIndex(item => item.productId == productId);

    if (cartItemIndex === -1) {
      console.log('Product not found in the cart:', productId);
      return res.status(404).json({ message: 'Product not found in the cart' });
    }

    // Remove the cart item from the array
    cart.cartItems.splice(cartItemIndex, 1);

    // Update the total price for all items
    cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

    // Save the updated cart
    await cart.save();

    // Log the updated state of the cart
    console.log('Cart after removal:', cart);

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};




module.exports.clearCart = async (req, res) => {
  try {
    const userId = req.body.userId;

    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for the user' });
    }

    // Log the current state of the cart for debugging
    console.log('Current Cart:', cart);

    // Clear all cart items
    cart.cartItems = [];

    // Update the total price to 0
    cart.totalPrice = 0;

    // Save the updated cart
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};