module.exports = {
    
    name: "autorol",
    description: "Agregarse roles",

    async execute(client, message, args, discord){
    
        const row = new discord.MessageActionRow()
            .addComponents(
                [
                    new discord.MessageButton()
                    .setCustomId("hombra")
                    .setLabel("Hombra")
                    .setStyle("PRIMARY")
                    .setEmoji("🐒")
                ],
                [
                    new discord.MessageButton()
                    .setCustomId("mujero")
                    .setLabel("Mujero")
                    .setStyle("PRIMARY")
                    .setEmoji("💎")
                ]
            );

        const embed = new discord.MessageEmbed()
            .setTitle("Este es un discord no-deconstruido. Elegí tu sexo:")
            .setColor("GREEN");

        message.channel.send({ embeds: [embed], components: [row] });
    }
}