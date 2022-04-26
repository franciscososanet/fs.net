const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Aislar a un usuario.")
        .addUserOption(option => option.setName("miembro").setDescription("El miembro que será muteado.").setRequired(true))
        .addStringOption(option => option.setName("tiempo").setDescription("El tiempo a mutear").setRequired(true))
        .addStringOption(option => option.setName("razon").setDescription("Motivo del muteo.").setRequired(true)),

        async run(client, interaction){
            const user = interaction.options.getUser("miembro");
            const tiempo = interaction.options.getString("tiempo");
            const razon = interaction.options.getString("razon");

            //let permisos = interaction.member.permission.has("MODERATE_MEMBERS");
            //if(!permisos) return interaction.reply("No tienes los permisos requeridos para utilizar este comando");

            const member = await interaction.guild.members.fetch(user.id);

            if(member.isCommunicationDisabled()) return interaction.reply("El usuario ya está muteado.");

            const time = ms(tiempo);

            await member.timeout(time, razon);

            const embed = new Discord.MessageEmbed()
                .setTitle(`${user.tag} ha sido muteado.`)
                .setDescription(`**Tiempo:** ${tiempo}\n**Razón:** ${razon}`)
                .setColor("RED")
                .setFooter(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        }
};