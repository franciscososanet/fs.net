const { getVoiceConnection } = require("@discordjs/voice");
const { queue } = require("../../global/music");

module.exports = {

  name: "stop",
  description: "Detiene el bot de música",

  run: async (client, interaction) => {

    const pvc = getVoiceConnection(interaction.guild.id);
    const vc = interaction.member.voice.channel;

    if (!vc) {
      return interaction.reply({ content: "Tenés que estar en un canal de voz", ephemeral: true });
    }

    if (!pvc){
      return interaction.reply({ content: "El bot no está reproduciendo música", ephemeral: true });
    }

    if (vc != pvc.joinConfig.channelId) {
      return interaction.reply({ content: "Tenés que estar en el mismo canal de voz que el bot", ephemeral: true });
    }

    const player = pvc.state.subscription.player;

    queue.delete(interaction.guild.id);

    player.stop();
    pvc.destroy();

    interaction.reply("Reproduccion eliminada");
  },
};