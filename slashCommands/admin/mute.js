const { MessageEmbed } = require("discord.js");
const discord = require("discord.js");
const ms = require("ms");

module.exports = {

    name: "mute",
    description: "Mutear a un usuario.",
    options: [
        {
            name: "usuario",
            description: "El usuario a mutear.",
            type: "USER",
            required: "true",
        },
        {
            name: "tiempo",
            description: "El tiempo a mutear.",
            type: "STRING",
            required: "true",
        },
        {
            name: "razon",
            description: "Motivo del muteo.",
            type: "STRING",
            required: "true",
        },
    ],
        
                
    run: async (client, interaction) => {

        const user = interaction.options.getUser("usuario");
        const tiempo = interaction.options.getString("tiempo");
        const razon = interaction.options.getString("razon");

        if(!interaction.member.permissions.has("MODERATE_MEMBERS")) return interaction.reply("No tienes los permisos requeridos para utilizar este comando");

        const member = await interaction.guild.members.fetch(user.id);

        if(member.isCommunicationDisabled()) return interaction.reply("El usuario ya está muteado.");

        const time = ms(tiempo);

        await member.timeout(time, razon);

        const embed = new discord.MessageEmbed()
            .setTitle(`${user.tag} ha sido muteado.`)
            .setDescription(`**Tiempo:** ${tiempo}\n**Razón:** ${razon}`)
            .setColor("RED")
            .setFooter(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
};