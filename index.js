const express = require("express");
const cors = require("cors");
const { fetchProducts } = require("./utilities/ProductFetch");
const { connectToDb } = require("./config/database");
const route = require("./routes/routes");
const { deleteEveryDoc } = require("./controller/controller");
const app = express();

// Global middlewares
app.use(express.json());
app.use(cors());
app.use(route);

app.listen(3001, async () => {
  console.log("server running on 3001");
  try {
    await connectToDb(); // Connect to the database
    await fetchProducts(); // Fetch products
    console.log("Initialization tasks completed successfully");
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1); // Exit with error
  }
});
