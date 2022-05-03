const play = require("play-dl");
const { createAudioResource } = require("@discordjs/voice");
const queue = new Map();

//CREAR REPRODUCTOR
const reproducir = async (player, msg, url, key) => {

  if (msg.type == "APPLICATION_COMMAND" && msg.replied == false) {
    msg.deferReply();
  }

  const ytInfo = await play.search(url);
  const stream = await play.stream(ytInfo[0].url);
  const emb = musicEmbed(
    ytInfo[0].title,
    ytInfo[0].description,
    ytInfo[0].url
  );

  if (msg.type == "APPLICATION_COMMAND") {
    msg.followUp({
      embeds: [emb],
    });
  } else {
    msg.reply({
      embeds: [emb],
    });
  }

  const resource = createAudioResource(stream.stream, {
    inputType: stream.type,
    metadata: {
      title: ytInfo[0].title,
      key: key,
    },
  });

  player.play(resource);
};

//AGREGAR CANCIONES A LA LISTA
const agregar = (guildId, song) => {

  const srv_queue = queue.get(guildId);

  if (!srv_queue) {
    const queue_const = { loop: false, songs: [] };
    queue.set(guildId, queue_const);
    queue_const.songs.push(song);
  } else {
    srv_queue.songs.push(song);
  }
};

//LOOP
const loopQueue = (guildId) => {

  const srv_queue = queue.get(guildId);
  if (!srv_queue) return "SN";
  srv_queue.loop = !srv_queue.loop;
  return srv_queue.loop;
};

//RETORNAR ARRAY DE OBJETOS CON INFO DE CANCIONES
const fullQueue = (guildId) => {

  const srv_queue = queue.get(guildId);
  if (!srv_queue) return "Sin Canciones";
  const songs = [];

  srv_queue.songs.forEach((song) => {
    songs.push(`**${song.title}** - **[Link](${song.url})**\n`);
  });

  return songs;
};

//ELIMINAR CANCIONES DE LA LISTA
const eliminar = (title, guildId) => {

  const srv_queue = queue.get(guildId);
  if (!srv_queue) return "Sin Canciones";

  const songTitle = (song) => song.title.includes(title);
  const songIndex = srv_queue.songs.findIndex(songTitle);
  const songFullTitle = srv_queue.songs.find(songTitle);

  if (!songIndex || songIndex == -1){
    return { msg: "No se encontro la cancion", title: title };
  }

  srv_queue.songs.splice(songIndex, 1);

  return { msg: "Cancion eliminada", title: songFullTitle.title };
};

//MUSICA EN REPRODUCCIÓN (EMBED)
const musicEmbed = (title, desc, link, image) => {

  return {
    author: {
      name: "FS.net MUSIC",
      icon_url:
        "https://franciscososa.net/fs.net/botImgProfile.png",
    },
    title: title,
    description: `${desc}\n**[LINK](${link})**`,
    color: "RED",
    image: { url: image },
  };
};

//QUEUE (EMBED)
const queueEmbed = (title, link, image) => {

  return {
    author: {
      name: "FS.net MUSIC",
      icon_url:
        "https://franciscososa.net/fs.net/botImgProfile.png",
    },
    title: "Cola de reproducción actualizada",
    description: `**Cancion agregadas a la cola de reproduccion.**\n\nTitulo: **${title}**\n**[LINK](${link})**`,
    color: "RED",
  };
};

//CANCIÓN SIGUIENTE
const nextSong = async (guildId, key, msg, player, connection, type) => {

  const queue_songs = queue.get(guildId);
  const songKey = (song) => song.key == key;
  const nextIndex = queue_songs.songs.findIndex(songKey) + 1;

  if (!queue_songs.songs[nextIndex]) {
    if (type === "auto" && queue_songs.loop) {
      reproducir(
        player,
        msg,
        queue_songs.songs[0].url,
        queue_songs.songs[0].key
      );
      if (msg.type == "APPLICATION_COMMAND") {
        return msg.followUp("Reiniciando las canciones...");
      } else {
        return msg.channel.send("Reiniciando las canciones...");
      }
    } else if (type === "auto") {
      connection.destroy();
      queue.delete(guildId);
      return msg.reply("Sin canciones por reproducir\nLista vacía.");
    }
    return msg.reply("No hay más canciones.");
  }

  reproducir(
    player,
    msg,
    queue_songs.songs[nextIndex].url,
    queue_songs.songs[nextIndex].key
  );
};

//CANCIÓN ANTERIOR
const previousSong = async (guildId, key, msg, player, connection) => {

  const queue_songs = queue.get(guildId);
  const songKey = (song) => song.key == key;
  const previousIndex = queue_songs.songs.findIndex(songKey) - 1;

  if (!queue_songs.songs[previousIndex]) {
    return msg.reply("No existen canciones previas a ésta.");
  }

  reproducir(
    player,
    msg,
    queue_songs.songs[previousIndex].url,
    queue_songs.songs[previousIndex].key
  );
};

module.exports = {
  queue,
  agregar,
  eliminar,
  fullQueue,
  musicEmbed,
  queueEmbed,
  nextSong,
  previousSong,
  loopQueue,
};