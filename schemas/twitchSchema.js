const { Schema, model } = require("mongoose");

const twitch = new Schema({

    twitchStream: { type: String, required: true },
    titulo: { type: String, required: true }
});

module.exports = model("twitchSchema", twitch);