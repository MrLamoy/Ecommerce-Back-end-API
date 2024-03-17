const Order = require("../models/Order");
const Cart = require("../models/Cart");

// module.exports.checkout = async (req, res) => {
//   try {
    
//     const userId = req.body.userId;

//     // Find the user's cart
//     const cart = await Cart.findOne({ userId: userId });

//     // Check if the cart is empty
//     if (!cart || cart.cartItems.length === 0) {
//       return res.status(400).json({ message: 'Cart is empty. Add items before checkout.' });
//     }

//     // Calculate total price from the cart items
//     const totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

//     // Create a new order
//     const order = new Order({
//       userId: userId,
//       cartItems: cart.cartItems,
//       totalPrice: totalPrice
//     });

//     // Save the order
//     await order.save();

//     // Clear the user's cart after successful checkout
//     cart.cartItems = [];
//     cart.totalPrice = 0;
//     await cart.save();

//     // Respond with the created order
//     res.status(201).json(order);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// };

// Update the checkout controller to handle a single item
// module.exports.checkout = async (req, res) => {
//   try {
//     const userId = req.body.userId;
//     const cartItems = req.body.cartItems;

//     // Check if the cart is empty
//     if (!cartItems || cartItems.length === 0) {
//       return res.status(400).json({ message: 'Cart is empty. Add items before checkout.' });
//     }

//     // Calculate total price from the cart items
//     const totalPrice = cartItems.reduce((total, item) => total + item.subtotal, 0);

//     // Create a new order for each item
//     const orders = await Promise.all(
//       cartItems.map(async (item) => {
//         const order = new Order({
//           userId: userId,
//           cartItems: [item], // Only include the current item in the order
//           totalPrice: item.subtotal, // Use the subtotal as total price for the single item
//         });

//         // Save the order
//         await order.save();

//         return order;
//       })
//     );

//     // Clear the user's cart after successful checkout
//     // This can be done outside the Promise.all block to clear the cart after all items are processed
//     // Alternatively, you can clear the cart for each item, depending on your requirements
//     // ...

//     // Respond with the created orders
//     res.status(201).json(orders);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// };



// module.exports.checkout = async (req, res) => {
//   try {
//     const userId = req.body.userId;
//     const cartItems = req.body.cartItems;

//     // Check if the cart is empty
//     if (!cartItems || cartItems.length === 0) {
//       return res.status(400).json({ message: 'Cart is empty. Add items before checkout.' });
//     }

//     // Calculate total price from the cart items
//     const totalPrice = cartItems.reduce((total, item) => total + item.subtotal, 0);

//     // Create a new order for each item
//     const orders = await Promise.all(
//       cartItems.map(async (item) => {
//         const order = new Order({
//           userId: userId,
//           cartItems: [item], // Only include the current item in the order
//           totalPrice: item.subtotal, // Use the subtotal as total price for the single item
//         });

//         // Save the order
//         await order.save();

//         return order;
//       })
//     );

//     // Clear the user's cart after successful checkout
//     await Cart.updateOne({ userId: userId }, { $set: { cartItems: [] } });

//     // Respond with the created orders
//     res.status(201).json(orders);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// };


module.exports.checkout = async (req, res) => {
  try {
    const userId = req.body.userId;
    const cartItems = req.body.cartItems;

    // Check if the cart is empty
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty. Add items before checkout.' });
    }

    // Calculate total price from the cart items
    const totalPrice = cartItems.reduce((total, item) => total + item.subtotal, 0);

    // Create a new order for all items
    const order = new Order({
      userId: userId,
      cartItems: cartItems, // Include all items in the order
      totalPrice: totalPrice, // Use the calculated total price
    });

    // Save the order
    await order.save();

    // Clear the user's cart after successful checkout
    await Cart.updateOne({ userId: userId }, { $set: { cartItems: [] } });

    // Respond with the created order
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


module.exports.getAuthenticatedUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; 

    // Fetch orders for the authenticated user
    const orders = await Order.find({ userId: userId });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


module.exports.getAllOrders = async (req, res) => {
  try {
    // Check if the authenticated user has admin privileges
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access forbidden. Admin only.' });
    }

    // Fetch all orders
    const orders = await Order.find();

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};