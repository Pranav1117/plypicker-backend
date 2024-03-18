// mongodb+srv://<username>:<password>@cluster0.yxuloml.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const mongoose = require("mongoose");

const url =
"mongodb+srv://Plypicker:Plypicker@cluster0.yxuloml.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
async function connectToDb() {
  try {
    await mongoose.connect(url);
    // console.log("conncted to db");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connectToDb };
