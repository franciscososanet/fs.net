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

        async function saveDataStreamer(msg, streamer){

            let data = await twitchModel.findOne({ name: streamer });

            if(!data){

                let uptime = await fetch.get(`https://decapi.me/twitch/uptime/${streamer}`);
                let avatar = await fetch.get(`https://decapi.me/twitch/avatar/${streamer}`);
                let viewers = await fetch.get(`https://decapi.me/twitch/viewercount/${streamer}`);
                let title = await fetch.get(`https://decapi.me/twitch/title/${streamer}`);
                let game = await fetch.get(`https://decapi.me/twitch/game/${streamer}`);


                let newdata = new twitchModel({
                    serverID: msg.guild.id,
                    channelNotif: msg.channel.id,
                    name: streamer,
                    title: title.body,
                    game: game.body,
                    isOn: uptime.body
                });
    
                return await newdata.save();
            }else{
                console.log(`ESTOY EN EL ELSE DE ${streamer}`);
                let title = await fetch.get(`https://decapi.me/twitch/title/${streamer}`);
                console.log(`${title.body}`);
            }

            //await twitchModel.findOneAndUpdate({

            //});




            /* var query = { serverID: `${msg.guild.id}` };
            var values = { 
                $set: { 
                    name: `${streamer}`,
                    channelNotif: `${msg.channel.id}` 
                }
            }; 
 
            await twitchModel.updateMany(query, values);
            */
        } 

        let filter = (m) => m.author.id == message.author.id; //Obtengo el id del usuario que ejecutó el comando, para solo colectar sus mensajes
        let collector = new discord.MessageCollector(message.channel, { filter, max: 1 }); //Se colectará como máximo 1 mensaje del usuario

        collector.on("collect", (msg) => {

            try{
                let streamers = msg.content.split(", "); //Almaceno en un array los streamers que escribió el usuario

                streamers.forEach(s => {                    
                    console.log(s);

                    saveDataStreamer(msg, s);
                });
            }catch(e){
                console.log(`Error: ${e}`);
            }
        }); 

        



             /*   
            
                guardarDataRoles(msg, arrayRolesName, arrayRolesId);

                const embed2 = new discord.MessageEmbed()
                .setTitle("ELEGÍ TUS ROLES CLICKEANDO EN LOS BOTONES DE ABAJO")
                .setColor("GREEN");

                message.channel.send({ embeds: [embed2], components: [row] }).then(sent => { //Mando el embed
                    let msgId = sent.id; //Obtengo su id
                    guardarMensajeId(msgId); //Y lo envio a la funcion para que lo lleve a la DB
                });

            }catch(error){
                message.channel.send(`**Ocurrió un error:** asegurate de estar escribiendo correctamente el nombre de todos los roles y de separarlos con una coma y espacio.\n**Ejemplo:** Rojo, Azul, Verde\n\n*Error: ${error}*`);
                console.log(error);
            }  */  
        



        /* async function guardarMensajeId(msgId){
            
            var query2 = { serverID: `${message.guild.id}` };
            var nuevoValor2 = { $set: { messageAutoRol: `${msgId}` } };
            await dataServerModel.updateOne(query2, nuevoValor2); //Guardo en al db el id del mensaje
        } */

        /*async function guardarDataRoles(msg, rolesName, rolesId){

            var query = { serverID: `${msg.guild.id}` };
            var values = { 
                $set: { 
                    rolName: `${rolesName}`,
                    rolID: `${rolesId}` 
                }
            }; 

            await dataServerModel.updateMany(query, values);
        } */



        



        

    }
}
