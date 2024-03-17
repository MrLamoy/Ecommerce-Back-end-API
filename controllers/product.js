 const Product = require("../models/Product");
const auth = require("../auth");


module.exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    });

    // Save the created object to the database
    const savedProduct = await newProduct.save();

    // Return the saved product details in the response
    res.status(201).json({
      message: 'Product created successfully',
      product: savedProduct,
    });
  } catch (error) {
    console.error('Error in creating product:', error);
    res.status(500).json({ error: 'Error in creating product' });
  }
};


module.exports.retrieveAllProducts = async (req, res) => {

    return Product.find({})
    .then(product => {

        if(product.length > 0){
            return res.status(200).send({ product });
        }
        else{
            
            return res.status(200).send({ message: 'No product found.' });
        }

    })
    .catch(err => {

        console.error("Error in finding all product", err);

        return res.status(500).send({ error: "Error finding product"});

    });
};


module.exports.retrieveActiveProducts = (req, res) => {

    Product.find({ isActive: true })
    .then(product => {
        if (product.length > 0){
            return res.status(200).send({ product });
        }
        else {
            return res.status(200).send({message: "There are no product at the moment."})
        }
    })
    .catch(err => {

        console.error("Error in finding active product: ", err);
        return res.status(500).send({ error: "Error in finding active product"})

    });

};


module.exports.retrieveSingleProduct = (req, res) => {

    console.log(req.params);

    Product.findById(req.params.productId)
    .then(product => {
        if (product) {
            return res.status(200).send({product})
        } else {
            return res.status(404).send({ error: 'product not found' })
        }
    })
    .catch(err => {
        console.error('Failed to fetch product', err); 
        res.status(500).send({ error: 'Failed to fetch product' });
    });
    
};


module.exports.updateProduct = (req, res)=>{

    const productId = req.params.productId;

    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    return Product.findByIdAndUpdate(productId, updatedProduct, {new: true})
    .then(product => {
        if (product) {

            return res.status(200).send({ 
                    message: 'Product updated successfully', 
                    updatedproduct: product 
                });
        } else {

             return res.status(404).send({ error: 'product not found' });
        }
    })
    .catch(err => {

        console.error("Error in updating a product: ", err);

        return res.status(500).send({ error: 'Error in updating a product.' });
    })
};


module.exports.archiveProduct = (req, res) => {

    let updateActiveField = {
        isActive: false
    }

    if (req.user.isAdmin == true){
        return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(product => {
            if (product) {
                return res.status(200).send({
                    message: 'Product archived successfully', 
                    archiveproduct: product 
                });
            } else {
                return res.status(404).send({ error: 'Product not found' });
            }
        })
        .catch(err => {
            console.error('Failed to archive product', err);   
            res.status(500).send({ error: 'Failed to archive product' });
        });
    }
    else{
        return res.status(403).send(false);
    }
};


module.exports.activateProduct = (req, res) => {

    let updateActiveField = {
        isActive: true
    }

    if (req.user.isAdmin == true){
        return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(product => {
            if (product) {
                return res.status(200).send({
                    message: 'Product activate successfully', 
                    archiveproduct: product 
                });
            } else {
                return res.status(404).send({ error: 'Product not found' });
            }
        })
        .catch(err => {
            console.error('Failed to activate product', err);   
            res.status(500).send({ error: 'Failed to activate product' });
        });
    }
    else{
        return res.status(403).send(false);
    }
};


module.exports.retrieveProductsByName = (req, res) => {
  const { productName } = req.body;

  if (!productName) {
    return res.status(400).json({ error: 'Product name is required in the request body' });
  }

  Product.find({ name: productName })
    .then(products => {
      if (products.length > 0) {
        return res.status(200).json({ products });
      } else {
        return res.status(404).json({ error: 'Products not found' });
      }
    })
    .catch(err => {
      console.error('Failed to fetch products', err);
      res.status(500).json({ error: 'Failed to fetch products' });
    });
};


module.exports.searchProductsByRange = (req, res) => {
  const { minPrice, maxPrice } = req.body;

  let query = {};

  // Add search by name
  
  
  // Add search by price range
  if (minPrice && maxPrice) {
    query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
  } else if (minPrice) {
    query.price = { $gte: parseFloat(minPrice) };
  } else if (maxPrice) {
    query.price = { $lte: parseFloat(maxPrice) };
  }

  Product.find(query)
    .then(foundProducts => {
      if (foundProducts.length > 0) {
        return res.status(200).json({ products: foundProducts });
      } else {
        return res.status(200).json({ message: 'No products found based on the search criteria.' });
      }
    })
    .catch(err => {
      console.error('Error in searching products:', err);
      res.status(500).json({ error: 'Error in searching products' });
    });
};


