const Discord = require("discord.js");

module.exports = { 
    name: "say",
    alias: [],

    execute(client, message, args){

        const mensaje = args.join(" ");
        if(!mensaje) return message.channel.send("Escribi algo, boludito");

        setTimeout(() => {
            message.delete();
            message.channel.send(`${mensaje}`) 
        }, 1000);
    }
}