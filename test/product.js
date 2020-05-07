process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
require("../models/Product");
const Product = mongoose.model("products");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();

chai.use(chaiHttp);

describe("Products", () => {
  beforeEach((done) => {
    Product.remove({}, (err) => {
      done();
    });
  });

  describe("/GET Produts", () => {
    it("it should get all orders", (done) => {
      chai
        .request(server)
        .get("/api/products")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  describe("/POST Product", () => {
    it("it should post a product", (done) => {
      let product = {
        name: "sa butter",
        description: "butter from sam",
        startingInventory: 200,
        mininumStock: 20,
      };
      chai
        .request(server)
        .post("/api/products")
        .send(product)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("message")
            .eql("Product successfully saved");
          done();
        });
    });

    it("it should not save a product without name", (done) => {
      let product = {
        description: "butter from sam",
        startingInventory: 200,
        mininumStock: 20,
      };
      chai
        .request(server)
        .post("/api/products")
        .send(product)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });

  describe("/GET/:id product", () => {
    it("it should GET a product by the given id", (done) => {
      let product = new Product({
        name: "peanut buttter",
        description: "butter from sam",
        startingInventory: 200,
        mininumStock: 20,
      });
      product.save((err, product) => {
        chai
          .request(server)
          .get("/api/products/" + product.id)
          .send(product)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          });
      });
    });
  });

  describe("PUT/:id product", () => {
    it("it should update a product given the id", (done) => {
      let product = new Product({
        name: "groundnut",
        description: "butter from sam",
        startingInventory: 200,
        mininumStock: 20,
      });
      product.save((err, product) => {
        chai
          .request(server)
          .put("/api/products/" + product.id)
          .send({
            name: "groundnut",
            description: "butter from sam",
            mininumStock: 40,
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("boolean");
            done();
          });
      });
    });
  });
});
