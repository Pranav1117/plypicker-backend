const mongoose = require("mongoose");

const user_model = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
});

const UserModel = mongoose.model("user_model", user_model);

module.exports = { UserModel };
