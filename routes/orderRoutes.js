const mongoose = require("mongoose");
const Order = mongoose.model("orders");
const Product = mongoose.model("products");
const requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
  //Add Orders
  app.post("/api/orders", requireLogin, async (req, res) => {
    const { quantity, productName } = req.body;

    const existingProduct = await Product.findOne({ name: productName });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product does not exist" });
    }

    const order = new Order({
      quantity,
      _product: existingProduct.id,
      orderedBy: req.user.name,
      dateOrdered: Date.now(),
    });
    existingProduct.inventoryShipped += quantity;
    existingProduct.inventoryOnHand -= quantity;

    try {
      const orders = await order.save();
      await existingProduct.save();
      res.status(200).json({ message: "Order successful" });
    } catch (err) {
      res.status(422).json({ error: err });
    }
  });

  app.get("/api/orders", requireLogin, async (req, res) => {
    let orders = await Order.find({});
    res.status(200).json(orders);
  });

  //get a particular order
  app.get("/api/orders/:orderId", requireLogin, async (req, res) => {
    let { orderId } = req.params;
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      let order = await Order.findById(orderId);
      if (order) {
        res.status(200).json(order);
      } else {
        return res.status(404).json({ error: "Order does not exist" });
      }
    } else {
      return res.status(400).json({ error: "Invalid Request" });
    }
  });

  //Get all orders for a product
  app.get(
    "/api/ordersforproduct/:productName",
    requireLogin,

    async (req, res) => {
      let { productName } = req.params;

      let existingProduct = await Product.findOne({ name: productName });
      if (existingProduct) {
        let orders = await Order.find({ _product: existingProduct._id });

        return res.status(200).json(orders);
      } else {
        return res.status(404).json({ error: "Product does not exist" });
      }
    }
  );
};
