const { Schema, model } = require("mongoose");

const twitch = new Schema({

    user: {
        type: String,
        required: true
    },

    titulo: {
        type: String,
        required: true
    }
});

module.exports = model("twitchSchema", twitch);