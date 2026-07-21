const mongoose = require("mongoose");

const housesDbSchema = new mongoose.Schema(
  {
    Hname: {
      type: String,
      required: true,
    },
    Haddress: {
      type: String,
      required: true,
    },
    Hrooms: {
      type: Number,
      required: true,
    },
    Hrating: {
      type: Number,
      required: true,
    },
    Hprice: {
      type: Number,
      required: true,
    },
    Hfloor: {
      type: Number,
      required: true,
    },
    Himg: {
      type: String,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      unique: true,
      immutable: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("houses", housesDbSchema);
