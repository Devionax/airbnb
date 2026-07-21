const mongoose = require("mongoose");

const favouritehomesSchema = new mongoose.Schema(
  {
    Hid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "houses",
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("favouriteHousesDB", favouritehomesSchema);
