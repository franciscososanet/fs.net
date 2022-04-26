const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Muestra el ping del bot."),

        async run(client, interaction){
            interaction.reply({ content: `Pong! **${client.ws.ping}ms**` })
        }
}