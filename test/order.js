process.env.NODE_ENV = "test";

const mongoose = require("mongoose");

require("../models/Order");
require("../models/Product");
const Order = mongoose.model("orders");
const Product = mongoose.model("products");

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();

chai.use(chaiHttp);

describe("Orders", () => {
  beforeEach((done) => {
    Order.remove({}, (err) => {
      done();
    });
  });

  beforeEach((done) => {
    Product.remove({}, (err) => {
      done();
    });
  });

  describe("/GET Orders", () => {
    it("it should get all Orders", (done) => {
      chai
        .request(server)
        .get("/api/orders")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  describe("/POST Order", () => {
    it("it should post an order", (done) => {
      let product = new Product({
        name: "groundnut",
        description: "butter from sam",
        startingInventory: 200,
        mininumStock: 20,
      });
      product.save((err, product) => {
        chai
          .request(server)
          .post("/api/orders")
          .send({
            quantity: 10,
            productName: product.name,
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("message").eql("Order successful");
            done();
          });
      });
    });
  });

  describe("/GET/:id order", () => {
    it("it should GET an order by the given id", (done) => {
      let order = new Order({
        quantity: 10,
        productName: "groundnut",
      });
      order.save((err, order) => {
        chai
          .request(server)
          .get("/api/orders/" + order.id)
          .send(order)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          });
      });
    });
  });

  describe("/GET/:productId all orders for a particular product", () => {
    it("it should get all orders given the id", (done) => {
      let product = new Product({
        name: "groundnut",
        description: "butter from sam",
        startingInventory: 200,
        mininumStock: 20,
      });
      product.save((err, product) => {
        chai
          .request(server)
          .get("/api/ordersforproduct/" + product.name)
          .send(product)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
          });
      });
    });
  });
});
