const axios = require("axios");
const { ProductsModel } = require("../model/ProductsModel");

async function fetchProducts() {
  try {
    const products = await axios.get(
      "https://64e0caef50713530432cafa1.mockapi.io/api/products"
    );
    await ProductsModel.deleteMany();
    await ProductsModel.insertMany(products.data);
    // console.log("products saved");
  } catch (error) {
    console.log(error);
  }
}

async function saveProductAfterAprrove(id, changes) {
  try {
   let updatedProduct= await ProductsModel.findByIdAndUpdate({ _id:id }, { $set: changes }, // Use $set to update multiple properties
   { new: true } );
   return updatedProduct; 
  } catch (error) {
    console.log(error);
  }
}

module.exports = { fetchProducts ,saveProductAfterAprrove};
