const { fullQueue } = require("../../global/music");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {

  name: "queue",
  description: "Muestra la cola de reproducción",

  run: async (client, interaction) => {

    const pvc = getVoiceConnection(interaction.guild.id);
    if (!pvc) return interaction.reply("No se está reproduciendo música");

    const songs = fullQueue(interaction.guild.id);

    const embed = {
      author: {
        name: "FS.net",
        icon_url:
          "https://franciscososa.net/fs.net/botImgProfile.png",
      },
      title: "Lista de reproducción",
      description: "Lista de reproducción:\n\n" + songs.join(""),
      color: "RED",
    };

    interaction.reply({ embeds: [embed] });
  },
};