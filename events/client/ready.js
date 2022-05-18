const colors = require("colors");
const discord = require("discord.js");
const { stream } = require("play-dl");

const dataServerModel = require("../../schemas/dataServer");

const fetch = require("node-superfetch");
const twitch = require("../../schemas/twitchSchema.js");

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
    async function testeando (streamer){

        try{
            let data = await twitch.findOne({ name: streamer, title: title.body });
        }catch(e){
            console.log(`Error!: ${e}`);
        }
        

        if(data.isOn){ //EL STREAMER ESTA ON

            let uptime = await fetch.get(`https://decapi.me/twitch/uptime/${streamer}`);
            let avatar = await fetch.get(`https://decapi.me/twitch/avatar/${streamer}`);
            let viewers = await fetch.get(`https://decapi.me/twitch/viewercount/${streamer}`);
            let title = await fetch.get(`https://decapi.me/twitch/title/${streamer}`);
            let game = await fetch.get(`https://decapi.me/twitch/game/${streamer}`);
    
            
    
            if(`${uptime.body}` !== `${streamer}`){
            console.log(` ${title.body} // ${data.titulo}`);
    
                const embed = new discord.MessageEmbed()
                    .setAuthor({ "name": `${streamer}`, "iconURL": `${avatar.body}` })
                    .setTitle(`${title.body}`)
                    .setThumbnail(`${avatar.body}`)
                    .setURL(`https://twitch.tv/${streamer}`)
                    .addField("Game", `${game.body}`, true)
                    .addField("Viewers", `${viewers.body}`, true)
                    .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer}-620x378.jpg`)
                    .setColor("BLURPLE");
    
                await client.channels.cache.get("968401302059098134").send({ content: `**¡${streamer}** ESTÁ STREMEANDO!\nhttps://twitch.tv/${streamer}`, embeds: [embed] });
    
                if(!data){
                    const newdata = new twitch({ name: streamer, title: `${title.body}`, game: `${game.body}`, isOn: true });
                    return await newdata.save();
                }
    
                if(data.title === `${title.body}`) return;
                await twitch.findOneAndUpdate({ name: streamer }, { title: title.body });
            }
        }else{
            console.log("STREAMER ESTA OFF");
        }
        

    }

    setInterval(async () => {

        let array = [ "polispol1", "elded", "elmariana", "rivers_gg", "duendepablo", "nimuvt", "panch1t", "robergalati"];

        for (let s of array){
            await testeando(`${s}`).catch(err => { console.log(err);})    
        }
    }, 120000)


};
