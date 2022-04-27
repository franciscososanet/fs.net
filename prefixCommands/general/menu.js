const discord = require("discord.js");

module.exports = {
    
    name: "menu",
    alias: [],

    async execute(client, message, args){

        const row = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageSelectMenu()
            .setCustomId("menuPrueba")
            .setMaxValues(1)
            .addOptions([
                {
                    label: "Opcion1",
                    description: "Descripcion opc1",
                    value: "Valor opcion 1",
                    emoji: "🤪"
                },
                {
                    label: "Opcion2",
                    description: "Descripcion opc2",
                    value: "Valor opcion 2",
                    emoji: "😍"
                },
            ])
        )


        const embed = new discord.MessageEmbed()
        .setTitle("Menu")
        .setColor("GREEN");

        const m = await message.channel.send({ embeds: [embed], components: [row] });

        const ifilter = i => i.user.id === message.author.id;

        const collector = m.createMessageComponentCollector({ filter: ifilter, time: 60000 });

        collector.on("collect", async i => {
            if(i.values[0] === "Valor opcion 1"){
                await i.deferUpdate()
                i.editReply({ content: "Respuesta a la opcion 1", embeds: [], components: [] });
            }

            if(i.values[0] === "Valor opcion 2"){
                await i.deferUpdate()
                i.editReply({ content: "Respuesta a la opcion 2", components: [row] });
            }

        });
    }
}