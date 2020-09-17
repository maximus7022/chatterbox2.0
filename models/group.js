const mongoose = require("mongoose");

const groupName = mongoose.Schema({
  name: { type: String, default: "", required: true },
  description: { type: String, default: "", required: true },
  image: { type: String, default: "default.png" },
  members: [
    {
      username: { type: String, default: "" },
      email: { type: String, default: "" },
    },
  ],
});

module.exports = mongoose.model("Group", groupName);
