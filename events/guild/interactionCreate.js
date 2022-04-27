const discord = require("discord.js");

module.exports = async (client, discord, interaction)  => {

    //CREAR TICKET
    if(interaction.isButton()){
        if(interaction.customId === "tickets"){
            const everyone = interaction.guild.roles.cache.find(r => r.name === "@everyone");
            interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
                type: "GUILD_TEXT",
                parent: "964272478958530611",
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                    },
                    {
                        id: everyone.id,
                        deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                    }
                ]
            }).then(c => {
                const mensaje = new discord.MessageEmbed()
                    .setTitle(`${interaction.user.username}, este es tu ticket`)
                    .setDescription("Escribe tu duda/pregunta/queja.\nSé paciente y espera por un moderador.")
                    .setColor("RANDOM");

                c.send({ embeds: [mensaje] });
            });    

            interaction.reply({ content: `<@${interaction.user.id}>, tu ticket ha sido creado.`, ephemeral: true });
        }
    }

    //CONTEXT MENU
    if(interaction.isCommand() || interaction.isContextMenu()){
        const slashcmds = client.slashcommands.get(interaction.commandName);

        if(!slashcmds) return;
        
        try{
            await slashcmds.run(client, interaction);
        }catch(e){
            console.error(e);
        }
    }

};