require("dotenv").config();

const discord = require("discord.js");
const intents = new discord.Intents();
const client = new discord.Client({ intents: 32767 });

//CONECTAR MONGODB
const mongoose = require("mongoose");

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("--------------------- LOGS DEL BOT ---------------------");
    console.log("- CONECTADO A MONGODB");
}).catch((error) => {
    console.log("ERROR AL CONECTARSE A MONGODB: " + error);
});


// CARGAR HANDLERS
client.commands = new discord.Collection();
client.events = new discord.Collection();
client.slash = new discord.Collection();

["commandHandler", "eventHandler", "slashHandler"].forEach((file) => {
    require(`./handlers/${file}`)(client, discord);
  });


//CONECTAR BOT
client.login(process.env.DSTOKEN);