const { Review } = require("../model/ReviewModel");

const fetchPendingReq = async (req, res) => {
  let response = await Review.find({ status: "pending" });
  return response;
};

const fetchCompleteReq = async (req, res) => {
  let response = await Review.find({ status: "complete" });
  return response;
};

module.exports = { fetchCompleteReq, fetchPendingReq };
