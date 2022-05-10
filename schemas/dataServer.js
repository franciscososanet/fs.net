const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  serverID: { type: String, require: true },
  serverName : { type: String, require: true },
  channelAutoRol : { type: String, require: true },
  messageAutoRol : { type: String, require: true },
  rolName : { type: String, require: true },
  rolID : { type: String, require: true}
});

const model = mongoose.model("dataServer", usersSchema);

module.exports = model;