const twitchModel = require("../../schemas/twitchSchema");
const fetch = require("node-superfetch");
const { stream } = require("play-dl");

module.exports = {
    
    name: "twitch",
    description: "Configurar notificación de streamers en Twitch",

    async execute(client, message, args, discord){
    
        const embed = new discord.MessageEmbed()
            .setTitle("Para configurar las notificaciones de los streamers de Twitch, a continuación escribí el nombre completo de cada uno de los ellos.\nDeben estar separados con una coma y un espacio de por medio.")
            .setDescription("Ejemplo: duendepablo, juansguarnizo, heedsagor, rivers_gg")
            .setColor("GREEN");
        
        message.channel.send({ embeds: [embed] });

        let filter = (m) => m.author.id == message.author.id; //Obtengo el id del usuario que ejecutó el comando, para solo colectar sus mensajes
        let collector = new discord.MessageCollector(message.channel, { filter, max: 1 }); //Se colectará como máximo 1 mensaje del usuario

        collector.on("collect", (msg) => {

            try{
                let streamers = msg.content.split(", "); //Almaceno en un array los streamers que escribió el usuario

                streamers.forEach(s => {                    
                    saveDataStreamer(msg, s);
                });
            }catch(e){
                console.log(`Error: ${e}`);
            }
        }); 

        async function saveDataStreamer(msg, streamer){

            let data = await twitchModel.findOne({ name: streamer });

            let uptime;
            let avatar;
            let viewers;
            let title;
            let game;

            if(!data){ //Si no hay data, la creo

                uptime = await fetch.get(`https://decapi.me/twitch/uptime/${streamer}`);
                avatar = await fetch.get(`https://decapi.me/twitch/avatar/${streamer}`);
                viewers = await fetch.get(`https://decapi.me/twitch/viewercount/${streamer}`);
                title = await fetch.get(`https://decapi.me/twitch/title/${streamer}`);
                game = await fetch.get(`https://decapi.me/twitch/game/${streamer}`);


                let newdata = new twitchModel({
                    serverID: msg.guild.id,
                    channelNotif: msg.channel.id,
                    name: streamer,
                    title: title.body,
                    game: game.body,
                    isOn: uptime.body
                });
    
                embedStreamer(msg, streamer, uptime, avatar, viewers, title, game);
                return await newdata.save();
                

            }else{ //Y si ya existia data, la actualizo

                uptime = await fetch.get(`https://decapi.me/twitch/uptime/${streamer}`);
                avatar = await fetch.get(`https://decapi.me/twitch/avatar/${streamer}`);
                viewers = await fetch.get(`https://decapi.me/twitch/viewercount/${streamer}`);
                title = await fetch.get(`https://decapi.me/twitch/title/${streamer}`);
                game = await fetch.get(`https://decapi.me/twitch/game/${streamer}`);

                var query = { name: `${streamer}` }; 
                var values = { 
                    $set: {
                        title: title.body,
                        game: game.body,
                        isOn: uptime.body
                    }
                };

                await twitchModel.updateMany(query, values);

                embedStreamer(msg, streamer, uptime, avatar, viewers, title, game);
            }
        } 

        async function embedStreamer(msg, streamer, uptime, avatar, viewers, title, game){

            let data = await twitchModel.findOne({ name: streamer });

            try{
                if(data.isOn !== `${streamer} is offline`){

                    const embed = new discord.MessageEmbed()
                        .setAuthor({ "name": `${streamer}`, "iconURL": `${avatar.body}` })
                        .setTitle(`${title.body}`)
                        .setThumbnail(`${avatar.body}`)
                        .setURL(`https://twitch.tv/${streamer}`)
                        .addField("Game", `${game.body}`, true)
                        .addField("Viewers", `${viewers.body}`, true)
                        .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer}-620x378.jpg`)
                        .setColor("BLURPLE");
    
                    await client.channels.cache.get(`${msg.channel.id}`).send({ content: `**¡${streamer}** ESTÁ STREMEANDO!\nhttps://twitch.tv/${streamer}`, embeds: [embed] });
    
                }else{
                    console.log(`Streamer ${streamer} OFFLINE`);
                }
            }catch(e){
                console.log(`Error: ${e}`);
            }  
        }
    }
}
