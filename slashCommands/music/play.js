const play = require("play-dl");
const { v4: uuidv4 } = require("uuid");

const {
  queue,
  agregar,
  musicEmbed,
  queueEmbed,
  nextSong,
} = require("../../global/music");

const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  AudioPlayerStatus,
  getVoiceConnection,
} = require("@discordjs/voice");

module.exports = {

  name: "play",
  description: "Reproducir una canción",
  options: [
    {
      name: "canción",
      description: "Nombre de canción y artista",
      type: "STRING",
      required: "true",
    },
  ],

  run: async (client, interaction) => {

    //CANAL DE VOZ
    const vc = interaction.member.voice.channel;
    if (!vc) {
      return interaction.reply({ content: "Tienes que estar en un canal de voz", ephemeral: true });
    }
    
    //BÚSQUEDA DE VIDEO
    const ytInfo = await play.search(interaction.options.getString("canción"));
    const stream = await play.stream(ytInfo[0].url);

    //AGREGAR CANCIÓN A LISTA DE REPRODUCCIÓN
    const song = { key: uuidv4(), title: ytInfo[0].title, url: ytInfo[0].url };
    agregar(interaction.guild.id, song);

    //COMPROBAR SI SE ESTÁ REPRODUCIENDO MÚSICA
    const pvc = getVoiceConnection(interaction.guild.id);
    if (pvc){
      return interaction.reply({
        embeds: [
          queueEmbed(ytInfo[0].title, ytInfo[0].url),
        ],
      });
    }

    //CONEXION
    const connection = joinVoiceChannel({
      channelId: vc.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const resource = createAudioResource(stream.stream, {
      inputType: stream.type,
      metadata: {
        title: ytInfo[0].title,
        key: song.key,
      },
    });

    const player = createAudioPlayer();
    player.play(resource);
    connection.subscribe(player);

    //RESPUESTA
    interaction.reply({
      embeds: [
        musicEmbed(
          ytInfo[0].title,
          ytInfo[0].description,
          ytInfo[0].url,
        ),
      ],
    });

    //EL BOT SE DESCONECTA AL TERMINAR LA MÚSICA
    // console.log(player.state.resource.metadata.key);
    //% oldS Recaba informacion de la cancion reproducida
    player.on(AudioPlayerStatus.Idle, async (oldS, newS) => {
      if (queue.get(interaction.guild.id).songs.length <= 1 && queue.get(interaction.guild.id).loop == false){
        connection.destroy();
        queue.delete(guildId);
        return;
      } else {
        return nextSong(interaction.guild.id, oldS.resource.metadata.key, interaction, player, connection, "auto");
      }
    });
  },
};