const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstname: { type: String, default: "" },
    lastname: { type: String, default: "" },
    email_address: { type: String, default: "" },
    phone_number: { type: String, default: "" },
    profile_picture: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
