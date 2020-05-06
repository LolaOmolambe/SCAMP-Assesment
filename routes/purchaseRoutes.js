const mongoose = require("mongoose");

const Purchase = mongoose.model("purchases");
const Product = mongoose.model("products");
var requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
  
    //Add Purchases
  app.post("/api/purchases", requireLogin, async (req, res) => {
    const { quantity, productName } = req.body;

    const existingProduct = await Product.findOne({ name: productName });

    if (!existingProduct) {
      return res.status(404).send({ error: "Product does not exist" });
    }

    const purchase = new Purchase({
      quantity,
      _product: existingProduct.id,
      //_supplier: req.user.name,
      datePurchased: Date.now(),
    });
    existingProduct.inventoryReceived += quantity; //increase inventory received,
    existingProduct.inventoryOnHand += quantity; //increases inventory on hand

    try {
      const purchases = await purchase.save();
      await existingProduct.save();
      res.status(200).send("Purchase successfully saved"); //or send true
    } catch (err) {
      res.status(422).send(err);
    }
  });

  app.get("/api/purchases", requireLogin, async (req, res) => {
    let purchases = await Purchase.find({});
    res.status(200).send(purchases);
  });

  //get a particular purchase
  app.get("/api/purchases/:purchaseId", requireLogin, async (req, res) => {
    let { purchaseId } = req.params;

    if (mongoose.Types.ObjectId.isValid(purchaseId)) {
      let purchase = await Purchase.findById(purchaseId);
      if (purchase) {
        res.status(200).send(purchase);
      } else {
        return res.status(404).send({ error: "Purchase does not exist" });
      }
    } else {
      return res.status(400).send({ error: "Invalid Request" });
    }
  });

  //Get all purchases for a product
  app.get(
    "/api/purchaseforproduct/:productName",
    requireLogin,
    async (req, res) => {
      let { productName } = req.params;

      let existingProduct = await Product.findOne({ name: productName });
      if (existingProduct) {
        let purchases = await Purchase.find({ _product: existingProduct._id });

        return res.status(200).send(purchases);
      } else {
        return res.status(404).send({ error: "Product does not exist" });
      }
    }
  );


};
