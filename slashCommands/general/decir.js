module.exports = {

    name: "decir",
    description: "Repetir un mensaje",
    options: [
        {
          name: "texto",
          description: "Lo que quieras hacer decir al bot",
          type: "STRING",
          required: "true",
        }
    ],

    run: async (client, interaction) => {
        const texto = interaction.options.getString("texto");
        await interaction.deferReply();
        setTimeout(() => {
            interaction.editReply({ content: `${texto}` })    
        }, 2000);
    }
}