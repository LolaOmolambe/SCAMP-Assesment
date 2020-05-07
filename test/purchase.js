process.env.NODE_ENV = "test";
const mongoose = require("mongoose");
require("../models/Purchase");
require("../models/Product");
const Purchase = mongoose.model("purchases");
const Product = mongoose.model("products");

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();

chai.use(chaiHttp);

describe("Purchases", () => {
  beforeEach((done) => {
    Purchase.remove({}, (err) => {
      done();
    });
  });

  beforeEach((done) => {
    Product.remove({}, (err) => {
      done();
    });
  });

  describe("/GET Purchases", () => {
    it("it should get all Purchases", (done) => {
      chai
        .request(server)
        .get("/api/purchases")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  describe("/POST Purchase", () => {
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
          .post("/api/purchases")
          .send({
            quantity: 10,
            productName: product.name,
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("message").eql("Purchase successful");
            done();
          });
      });
    });
  });

  describe("/GET/:id purchase", () => {
    it("it should GET a purchase by the given id", (done) => {
      let purchase = new Purchase({
        quantity: 10,
        productName: "groundnut",
      });
      purchase.save((err, purchase) => {
        chai
          .request(server)
          .get("/api/purchases/" + purchase.id)
          .send(purchase)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          });
      });
    });
  });

  describe("/GET/:productId all purchase for a particular product", () => {
    it("it should get all purchase history given the id", (done) => {
      let product = new Product({
        name: "groundnut",
        description: "butter from sam",
        startingInventory: 200,
        mininumStock: 20,
      });
      product.save((err, product) => {
        chai
          .request(server)
          .get("/api/purchaseforproduct/" + product.name)
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
