const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removetimeout")
        .setDescription("Desmutear a un usuario.")
        .addUserOption(option => option.setName("miembro").setDescription("El miembro que será muteado.").setRequired(true)),

        async run(client, interaction){
            const user = interaction.options.getUser("miembro");

            let permisos = interaction.member.permissions.has("MODERATE_MEMBERS");
            if(!permisos) return interaction.reply("No tienes los permisos requeridos para utilizar este comando");

            const member = await interaction.guild.members.fetch(user.id);

            if(!member.isCommunicationDisabled()) return interaction.reply("El usuario no está muteado.");

            await member.timeout(null);

            interaction.reply(`**${user.tag}** ha sido desmuteado correctamente.`);
        }
};