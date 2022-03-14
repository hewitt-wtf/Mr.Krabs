const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  money: {
    type: Number,
    default: 0
  }
});
module.exports = mongoose.model("user-schema", userSchema)