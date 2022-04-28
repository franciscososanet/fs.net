module.exports = {
    
    name: "ping",
    description: "Mostrar el ping del bot",

    run: async(client, interaction) => {
        interaction.reply({ content: `Pong! **${client.ws.ping}ms**` });
    }
    
}