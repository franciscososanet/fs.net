const mongoose = require("mongoose");

const twitch = new mongoose.Schema({
    serverID: { type: String, required: true},
    channelNotif: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    game: { type: String, required: true },
    isOn: { type: String, required: true }
});

const model = mongoose.model("twitchSchema", twitch)

module.exports = model;