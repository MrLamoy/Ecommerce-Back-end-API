const express = require("express");
const productController = require("../controllers/product");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();




router.post("/createProduct", verify, verifyAdmin, productController.createProduct);

router.get("/all", verify, verifyAdmin, productController.retrieveAllProducts);

router.get("/active", productController.retrieveActiveProducts);

router.get("/:productId", productController.retrieveSingleProduct);

router.put("/:productId",verify, verifyAdmin, productController.updateProduct);

router.patch("/archive/:productId",verify, verifyAdmin, productController.archiveProduct);

router.patch("/activate/:productId",verify, verifyAdmin, productController.activateProduct);

router.post('/search', productController.retrieveProductsByName);

router.post('/search-price-range', productController.searchProductsByRange);



module.exports = router;