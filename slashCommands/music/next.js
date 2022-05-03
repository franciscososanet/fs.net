const { getVoiceConnection } = require("@discordjs/voice");
const { nextSong } = require("../../global/music");

module.exports = {

  name: "next",
  description: "Pasar a la siguiente canción",

  run: async (client, interaction) => {

    const mvc = interaction.member.voice.channel.id;
    const pvc = getVoiceConnection(interaction.guild.id);

    if (!pvc) return interaction.reply("No se está reproduciendo música");

    if (mvc != pvc.joinConfig.channelId) {
      return interaction.reply("Tenés que estar en el mismo canal de voz.");
    }

    const player = getVoiceConnection(interaction.guild.id).state.subscription.player;

    nextSong(interaction.guild.id, player.state.resource.metadata.key, interaction, player, pvc, "cmd");
  },
};