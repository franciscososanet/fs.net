const colors = require("colors");
const discord = require("discord.js");
const { stream } = require("play-dl");
const dataServerModel = require("../../schemas/dataServer");

module.exports = async (client, member) => {

    client.user.setUsername("FS.net");
    client.user.setActivity("www.franciscososa.net", { type: 'WATCHING' });
    client.user.setStatus("online");

    console.log(`- BOT ${client.user.username} (${client.user.id}) ESTÁ EN LINEA\n`);

    //OBTENER IDs Y NOMBRES DE DONDE SE ENCUENTRA EL BOT
    const serversIds = client.guilds.cache.map(guild => guild.id); 
    const serversNombres = client.guilds.cache.map(guild => guild.name);

    //RECORRO LOS ID Y LOS BUSCO EN MI DB. SI NO EXISTEN, LOS REGISTRO
    for(var i = 0; i < serversIds.length; i++){

        let serverData = await dataServerModel.findOne({ serverID: serversIds[i]  });

        if(serverData){ 
            console.log(colors.green(`EL SERVER "${serversNombres[i]}" (${serversIds[i]}) YA SE ENCUENTRA REGISTRADO`));

        }else{ 
            try { //REGISTRO EL SERVER
                let data = await dataServerModel.create({
                    serverID: serversIds[i],
                    serverName: serversNombres[i],
                    channelAutoRol: null,
                    messageAutoRol: null,
                    rolName: null,
                    rolID: null
                });
                data.save();
                console.log(colors.bgCyan( `SE REGISTRÓ EL SERVER "${serversNombres[i]}" (${serversIds[i]})`));
              } catch (error) {
                console.log(error);
            }
        }

    }

    //NOTIFICACIONES TWITCH ====> CREAR UN ARRAY Y QUE SE MANDEN MENSAJES POR CADA STREAM SI ES QUE ESTA ENCENDIDO
    setInterval(async function(){

        const fetch = require("node-superfetch");

        let twitchStreamers = ["iamcristinini", "reborn_live", "tanizen"];
        //let user = "carola";

        for (var i = 0; i < twitchStreamers.length; i++) {

            const uptime = await fetch.get(`https://decapi.me/twitch/uptime/${twitchStreamers[i]}`);
            const avatar = await fetch.get(`https://decapi.me/twitch/avatar/${twitchStreamers[i]}`);
            const viewers = await fetch.get(`https://decapi.me/twitch/viewercount/${twitchStreamers[i]}`);
            const title = await fetch.get(`https://decapi.me/twitch/title/${twitchStreamers[i]}`);
            const game = await fetch.get(`https://decapi.me/twitch/game/${twitchStreamers[i]}`);

            const twitch = require("../../schemas/twitchSchema.js");

            let data = await twitch.findOne({ twitchStream: twitchStreamers[i], titulo: title.body });

            if(uptime.body !== `${twitchStreamers[i]} is offline`){

                const embed = new discord.MessageEmbed()
                    .setAuthor({ "name": `${twitchStreamers[i]}`, "iconURL": `${avatar.body}` })
                    .setTitle(`${title.body}`)
                    .setThumbnail(`${avatar.body}`)
                    .setURL(`https://twitch.tv/${twitchStreamers[i]}`)
                    .addField("Game", `${game.body}`, true)
                    .addField("Viewers", `${viewers.body}`, true)
                    .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${twitchStreamers[i]}-620x378.jpg`)
                    .setColor("BLURPLE");

                if(!data){
                    const newdata = new twitch({
                        twitchStream: twitchStreamers[i],
                        titulo: `${title.body}`
                    });

                    await client.channels.cache.get("968401302059098134").send({ content: `**¡${twitchStreamers[i]}** ESTÁ STREMEANDO!\nhttps://twitch.tv/${twitchStreamers[i]}`, embeds: [embed] });
                    return await newdata.save();
                }

                if(data.titulo === `${title.body}`) return;
                await client.channels.cache.get("968401302059098134").send({ content: `${twitchStreamers[i]} **NONONONO está stremeando.**\nhttps://twitch.tv/${twitchStreamers[i]}`, embeds: [embed] });
                console.log("NONONO esta stremeando");
                await twitch.findOneAndUpdate({ twitchStream: twitchStreamers[i] }, { titulo: title.body });
            }
        }      
    }, 10000);

};
