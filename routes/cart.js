const express = require("express");
const cartController = require("../controllers/cart");


const router = express.Router();

// router.post('/', cartController.getUserCart);
router.get('/:userId', cartController.getUserCart);

router.post('/addToCart', cartController.addToCart);

router.put('/udpateQuantity', cartController.udpateQuantity);

router.delete('/:productId/removeFromCart', cartController.removeFromCart);

router.delete('/clearCart', cartController.clearCart);


module.exports = router;