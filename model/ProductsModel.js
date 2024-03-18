  const mongoose = require("mongoose");

  const products_model = new mongoose.Schema({
    productName: {
      type: String,
    },
    price: {
      type: Number,
    },
    image: {
      type: String,
    },
    productDescription: {
      type: String,
    },
    department: {
      type: String,
    },
    id: {
      type: Number,
    },
  });

  const ProductsModel = mongoose.model("product_model", products_model);

  module.exports = { ProductsModel };
