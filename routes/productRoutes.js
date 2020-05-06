const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");

const Product = mongoose.model("products");

module.exports = (app) => {
  //Add Products
  app.post("/api/products", requireLogin, async (req, res) => {
    const { name, description, startingInventory, mininumStock } = req.body;

    const existingProduct = await Product.findOne({ name: name });

    if (existingProduct) {
      return res.status(409).send({ error: "Product already exists" });
    }

    const product = new Product({
      name,
      description,
      startingInventory,
      inventoryOnHand: startingInventory,
      mininumStock,
      dateCreated: Date.now(),
      dateModified: Date.now(),
    });

    try {
      const products = await product.save();
      res.status(200).send(products.id); //or send true
    } catch (err) {
      res.status(422).send(err);
    }
  });

  app.get("/api/products", requireLogin, async (req, res) => {
    const products = await Product.find({});
    res.status(200).send(products);
  });

  app.get("/api/products/:productId", requireLogin, async (req, res) => {
    let { productId } = req.params;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      let product = await Product.findById(productId);
      if (product) {
        res.status(200).send(product);
      } else {
        return res.status(404).send({ error: "Product does not exist" });
      }
    } else {
      return res.status(400).send({ error: "Invalid Request" });
    }
  });

  app.put("/api/products/:productId", requireLogin, async (req, res) => {
    let { productId } = req.params;
    let { name, description, mininumStock } = req.body;
    if (mongoose.Types.ObjectId.isValid(productId)){
        let product = await Product.updateOne(
            {
              _id: productId,
            },
            {
              name: name,
              description: description,
              $set:{mininumStock:mininumStock},
              dateModified: new Date(),
            }
          ).exec();
          
          res.send(true);
    }
    else {
        return res.status(400).send({ error: "Invalid Request" });
    }
    
  });
};
