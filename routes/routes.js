const {
  getAllProducts,
  userLogin,
  userRegister,
  getUser,
  getProductById,
  createReview,
  updateProduct,
  getAllRequest,
  changeStatus,
  getAllUserRequest,
  getReviewProductById,
  approveRejectRequest,
} = require("../controller/controller");

const route = require("express").Router();

route.get("/productlist", getAllProducts);

route.get("/product/:product_id", getProductById);

route.post("/login", userLogin);

route.post("/register", userRegister);

route.get("/getuser", getUser);

route.post("/product/review", createReview);

route.put("/updateproduct", updateProduct);

route.get("/getallrequests", getAllRequest);

route.put("/chng", changeStatus);

route.get("/getusersreq/:user", getAllUserRequest);

route.get("/getreviewproduct/:id", getReviewProductById);

route.put("/updateRequest", approveRejectRequest);

module.exports = route;
