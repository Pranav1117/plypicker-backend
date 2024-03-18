const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "product_model",
    },
    productName: {
      type: String,
    },
    userId: {
      type: String,
      ref: "user_model",
    },
    changes: {
      type: Object,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("review_model", reviewSchema);

module.exports = { Review };
