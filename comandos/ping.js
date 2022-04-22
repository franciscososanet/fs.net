const Discord = require("discord.js");

module.exports = {
    name: "ping",
    alias: ["hola"],

    execute(client, message, args){

        let permisoUsuario = message.member.permissions.has("ADMINISTRATOR"); //Chequear permisos de un usuario que quiera utilizar el comando
        let permisoBot = message.guild.me.permissions.has("KICK_MEMBERS"); //Chequear permisos del bot a la hora de ejecutar un comando

        if(permisoUsuario){
            message.channel.send(`Pong! **${client.ws.ping}ms**`);
        }else{
            return message.channel.send("No tenés los permisos correspondientes para ejecutar ese comando");
        } 

        if(!permisoBot) return message.channel.send("No tengo los permisos correspondientes");
    }
    
}