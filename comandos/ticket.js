const Discord = require("discord.js");

module.exports = {
    name: "ticket",
    alias: [],

    execute(client, message, args){
        const embed = new Discord.MessageEmbed()
            .setTitle("Tickets")
            .setDescription("Se creará un ticket al clickear el botón.")
            .setColor("GREEN");

        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId("tickets")
                    .setStyle("SUCCESS")
                    .setLabel("Crear Ticket")
                    .setEmoji("🎫")
            );

        message.channel.send({ embeds: [embed], components: [row] });
    }
    
}