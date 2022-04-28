const { MessageEmbed } = require("discord.js");
const discord = require("discord.js");
const snipe = require("../../schemas/snipeSchema.js");

module.exports = {

    name: "snipe",
    description: "Muestra el último mensaje borrado del canal.",
        
    run: async (client, interaction) => {
        let data = await snipe.findOne({ channelId: interaction.channel.id });

        if(!data){
            return interaction.reply({ content: "No se ha borrado ningún mensaje", ephemeral: true })
        }

        const embed = new discord.MessageEmbed()
            .setTitle(`Mensaje de ${data.author}`)
            .setDescription(`${data.message}`)
            .setColor("RANDOM")
            .addField("Canal", `<#${data.channelId}>`, true)
            .addField("Tiempo", `<t:${data.time}:R>`, true)
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
}