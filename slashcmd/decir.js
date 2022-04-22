const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("decir")
        .setDescription("Escribir un mensaje a través del bot.")
        .addStringOption(option => option.setName("texto").setDescription("Lo que quieras hacer decir al bot").setRequired(true)),

        async run(client, interaction){
            const texto = interaction.options.getString("texto");
            await interaction.deferReply();
            setTimeout(() => {
                interaction.editReply({ content: `${texto}` })    
            }, 2000);
        }
}