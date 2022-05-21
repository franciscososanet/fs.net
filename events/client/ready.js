const colors = require("colors");

module.exports = async (client) => {

    client.user.setUsername("FS.net");
    client.user.setActivity("www.franciscososa.net", { type: 'WATCHING' });
    client.user.setStatus("online");

    console.log(colors.bgYellow(`- BOT ${client.user.username} (${client.user.id}) ESTÁ EN LINEA\n`));

    //NOTIFICACIONES TWITCH
    /* 
        Deberia crear una funcion en setinterval que al encender el bot, chequee la data en la DB.
            > En caso de que existan streamers, se mandan los mensajes de notificacion al canal correspondiente.
            > La lógica de esto seria que no se ejecute hasta que algun admin del server utilice fs.twitch y llene la db con los datos.
            > Entonces, despues de X tiempo (este setinterval), al llamar la funcion y al haber datos, se mandarian las notificaciones.
            > Lo que faltaría al final es que se haga un chequeo de cuando fue la ultima vez que se envio la notificacion de X streamer, para no spamear mas de una vez
        por streamer que esté ON.
    */

    /*for(var i = 0; i < serversIds.length; i++){

        let data = await twitchModel.findOne({ serverID: serversIds[i]  });
        console.log(data);
        


        if(data){
            console.log("Hay data en este server!");
            console.log(data);
            console.log(serversIds.length);
            console.log(data[i].name);


            uptime = await fetch.get(`https://decapi.me/twitch/uptime/${data.name}`);
            avatar = await fetch.get(`https://decapi.me/twitch/avatar/${data.name}`);
            viewers = await fetch.get(`https://decapi.me/twitch/viewercount/${data.name}`);
            title = await fetch.get(`https://decapi.me/twitch/title/${data.name}`);
            game = await fetch.get(`https://decapi.me/twitch/game/${data.name}`);

            const embed = new discord.MessageEmbed()
                        .setAuthor({ "name": `${data.name}`, "iconURL": `${avatar.body}` })
                        .setTitle(`${title.body}`)
                        .setThumbnail(`${avatar.body}`)
                        .setURL(`https://twitch.tv/${data.name}`)
                        .addField("Game", `${game.body}`, true)
                        .addField("Viewers", `${viewers.body}`, true)
                        .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${data.name}-620x378.jpg`)
                        .setColor("BLURPLE");
    
            await client.channels.cache.get(`${msg.channel.id}`).send({ content: `**¡${streamer}** ESTÁ STREMEANDO!\nhttps://twitch.tv/${streamer}`, embeds: [embed] });
        
        }else{
            console.log("No hay data en este server");
        }
    }*/
}
