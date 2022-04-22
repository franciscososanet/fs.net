const Discord = require("discord.js");

module.exports = {
    name: "boton",
    alias: [],

    async execute(client, message, args){
        const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setCustomId("b1")
            .setLabel("Boton 1")
            .setStyle("PRIMARY")
            .setEmoji("😎")
        )

        const m = await message.channel.send({content: "Prueba", components: [row] });

        const ifilter = i => i.user.id === message.author.id;

        const collector = m.createMessageComponentCollector({ filter: ifilter, time: 60000})

        collector.on("collect", async i => {
            if(i.customId === "b1"){
                await i.deferUpdate()
                i.editReply({ content: "Hola!", components: [] })
            }
        });
    }
}