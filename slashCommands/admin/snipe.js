const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const snipe = require("../../schemas/snipeSchema.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("snipe")
        .setDescription("Muestra el último mensaje borrado del canal."),

        async run(client, interaction){
            let data = await snipe.findOne({ channelId: interaction.channel.id });

            if(!data){
               return interaction.reply({ content: "No se ha borrado ningún mensaje", ephemeral: true })
            }

            const embed = new Discord.MessageEmbed()
                .setTitle(`Mensaje de ${data.author}`)
                .setDescription(`${data.message}`)
                .setColor("RANDOM")
                .addField("Canal", `<#${data.channelId}>`, true)
                .addField("Tiempo", `<t:${data.time}:R>`, true)
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        }
}