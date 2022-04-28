module.exports = {

    name: "unmute",
    description: "Desmutear a un usuario",
    options: [
        {
            name: "usuario",
            description: "usuario a desmutear",
            type: "USER",
            required: true,
        }
    ],

    run: async(client, interaction) => {
        const user = interaction.options.getUser("usuario");

        if(!interaction.member.permissions.has("MODERATE_MEMBERS")) return interaction.reply("No tienes los permisos requeridos para utilizar este comando");

        const member = await interaction.guild.members.fetch(user.id);

        if(!member.isCommunicationDisabled()) return interaction.reply("El usuario no está muteado.");

        await member.timeout(null);

        interaction.reply(`**${user.tag}** ha sido desmuteado correctamente.`);
    }
};