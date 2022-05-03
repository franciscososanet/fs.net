const { eliminar } = require("../../global/music");

module.exports = {

  name: "delsong",
  description: "Eliminar una cancion de la lista de reproducción",
  options: [
    {
      name: `titulo`,
      description: `Nombre completo de la canción`,
      type: "STRING",
      required: "true",
    },
  ],

  run: async (client, interaction) => {
    
    const res = eliminar(
      interaction.options.getString("titulo"),
      interaction.guild.id
    );
    const embed = {
      author: {
        name: "FS.net",
        icon_url:
          "https://franciscososa.net/fs.net/botImgProfile.png",
      },
      title: `${res.msg}`,
      description: `Cancion: **${res.title}**`,
      color: "RED",
    };

    interaction.reply({ embeds: [embed] });
  },
};