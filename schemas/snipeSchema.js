const mongoose = require("mongoose");

const snipe = new mongoose.Schema({
    channelId: { type: String, required: true },
    message: { type: String, required: true },
    author: { type: String, required: true },
    time: { type: Number, required: true },
});

const model = mongoose.model("snipeSchema", snipe)
module.exports = model;
