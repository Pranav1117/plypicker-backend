const { ProductsModel } = require("../model/ProductsModel");
const { UserModel } = require("../model/UserModel");
const { Review } = require("../model/ReviewModel");
const {
  fetchCompleteReq,
  fetchPendingReq,
} = require("../utilities/RequestFetch");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { saveProductAfterAprrove } = require("../utilities/ProductFetch");
dotenv.config();
const { ObjectId } = mongoose.Types;
const SECRET_KEY = process.env.secretKey;

const userRegister = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const isAlreadyRegistered = await UserModel.findOne({ email, role });

    if (isAlreadyRegistered) {
      return res.status(409).json({
        message: "User already registered",
      });
    }

    // hashing password before storing in database using bcrypt library
    const hassPass = await bcrypt.hash(password, 10);

    const tempObj = new UserModel({
      email,
      password: hassPass,
      role,
    });

    // saving user in db
    await tempObj.save();

    // generating json web token with expiration of 3 days
    const token = jwt.sign({ email, role }, SECRET_KEY, { expiresIn: "3d" });

    // sending jwt to client where it wll stored in localstoage
    return res.status(200).json({
      message: "User registered successfully",
      token,
      role,
    });
  } catch (error) {
    // handling any error that comes while registering User
    return res.status(500).json({
      message: "An error occurred while registering user",
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const isRegisteredUser = await UserModel.findOne({ email, role });

    if (!isRegisteredUser) {
      return res.status(404).json({
        message: "No user found",
      });
    }

    const isMatch = await bcrypt.compare(password, isRegisteredUser.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "please enter correct password",
      });
    }

    const token = jwt.sign({ email, role }, SECRET_KEY, { expiresIn: "3d" });

    res.status(200).json({
      token,
      message: "User logged in successfully",
      user: {
        role,
        email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while logging",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductsModel.find();
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const getUser = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];
  try {
    const decodedUser = await jwt.decode(token, SECRET_KEY);
    const user = await UserModel.findOne({ email: decodedUser.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.product_id;
    const product = await ProductsModel.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createReview = async (req, res) => {
  // console.log(req.body, "in create revieqw");
  const { changes } = req.body;
  // console.log(changes);

  try {
    const tempObject = new Review({
      productId: req.body.product.id,
      userId: req.body.product.email,
      productName: req.body.product.productName,
      changes: changes,
    });
    const resp = await tempObject.save();
    res
      .status(201)
      .json({ msg: "Review updated successfully", resp, status: "pending" });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Failed to update review" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.body;

  try {
    const productToUpdate = await ProductsModel.findOne({ id: id });

    if (!productToUpdate) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.body.productName) {
      productToUpdate.productName = req.body.productName;
    }
    if (req.body.price) {
      productToUpdate.price = req.body.price;
    }
    if (req.body.productDescription) {
      productToUpdate.productDescription = req.body.productDescription;
    }
    if (req.body.department) {
      productToUpdate.department = req.body.department;
    }

    let response = await productToUpdate.save();

    res.status(200).json({ message: "Product updated successfully", response });
  } catch (error) {
    console.log(error);
  }
};

const getAllRequest = async (req, res) => {
  // console.log("statuse", req.query.status);
  try {
    if (req.query.status === "pending") {
      let pendingRequests = await fetchPendingReq();
      // console.log(pendingRequests);
      return res.status(200).json({ pendingRequests });
    }

    if (req.query.status === "approved") {
      let completeRequests = await fetchCompleteReq();
      return res.status(200).json({ completeRequests });
    }

    if (req.query.status === "rejected") {
      let completeRequests = await fetchCompleteReq();
      return res.status(200).json({ completeRequests });
    }

    // Fetch all requests if no specific status is requested
    let allRequests = await Review.find();
    return res.status(200).json({ allRequests });
  } catch (error) {
    console.error("Error getting all requests:", error);
    return res.status(500).json({ message: "Failed to get all requests" });
  }
};

const getAllUserRequest = async (req, res) => {
  let { user } = req.params;
  // console.log(user);
  let userReq = await Review.find({ "changes.email": user });
  console.log(userReq, "in get user specific request");
  return res.send(userReq);
};

const getReviewProductById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const resp = await Review.findOne({ _id: id });
  console.log(resp);

  return res.send(resp);
};

const changeStatus = async (req, res) => {
  const { id } = req.body;
  let pro = await Review.findOne({ productId: id });

  pro.status = "complete";

  let a = await pro.save();
  return res.send(a);
};

const approveRejectRequest = async (req, res) => {
  try {
    const { status, productId, _id, changes } = req.body;

    if (status === "approved") {
      function mergeObjects(arr) {
        const merged = {};
        for (const obj of arr) {
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              merged[key] = obj[key];
            }
          }
        }
        return merged;
      }

      const mergedObject = mergeObjects(changes);

      const resp = await Review.findOneAndUpdate({ _id }, { status });

      const product = await ProductsModel.findOne({ id: productId });

      if (mergedObject.productName) {
        let a = await product.updateOne({
          productName: mergedObject.productName,
        });
      }
      if (mergedObject.image) {
        let a = await product.updateOne({
          image: mergedObject.image,
        });
      }
      if (mergedObject.productDescription) {
        let a = await product.updateOne({
          productDescription: mergedObject.productDescription,
        });
      }
      if (mergedObject.department) {
        let a = await product.updateOne({
          department: mergedObject.department,
        });
      }
      if (mergedObject.price) {
        let a = await product.updateOne({
          price: mergedObject.price,
        });
      }

      // return res.sendStatus(200).json({ message: "successfully updated" });
    }

    if (status === "rejected") {
      const resp = await Review.findOneAndUpdate({ _id }, { status });
      console.log(resp, "in rejcted");
      return res.json({ message: "status updated" });
    }
    // res.send({ message: "success" });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = {
  getReviewProductById,
  getAllUserRequest,
  changeStatus,
  getAllRequest,
  getAllProducts,
  userLogin,
  userRegister,
  getUser,
  getProductById,
  createReview,
  updateProduct,
  approveRejectRequest,
};
