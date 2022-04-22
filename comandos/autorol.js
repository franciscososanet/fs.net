const Discord = require("discord.js");

module.exports = {
    name: "autorol",
    alias: [],

    async execute(client, message, args){
    
        const row = new Discord.MessageActionRow()
            .addComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("hombra")
                    .setLabel("Hombra")
                    .setStyle("PRIMARY")
                    .setEmoji("🐒")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("mujero")
                    .setLabel("Mujero")
                    .setStyle("PRIMARY")
                    .setEmoji("💎")
                ]
            );

        const embed = new Discord.MessageEmbed()
            .setTitle("Este es un discord no-deconstruido. Elegí tu sexo:")
            .setColor("GREEN");

        message.channel.send({ embeds: [embed], components: [row] });
    }
}