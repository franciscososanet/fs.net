const dataServerModel = require("../../schemas/dataServer");

module.exports = {
    
    name: "autorol2",
    description: "Configurar y agregar autoroles",

    async execute(client, message, args, discord){

        const embed = new discord.MessageEmbed()
            .setTitle("Para configurar los autoroles, a continuación escribí el nombre completo de cada uno de los roles.\nDeben estar separados con una coma y un espacio de por medio.")
            .setDescription("Ejemplo: Argentina, Chile, Bolivia, Peru")
            .setColor("GREEN");
        
        message.channel.send({ embeds: [embed] });

        try{
            var query = { serverID: `${message.guild.id}` }; //Creo una query que busca el serverID
            var nuevoValor = { $set: { channelAutoRol: `${message.channel.id}` } }; //Y le seteo el id de este canal al channelAutoRol
            await dataServerModel.updateOne(query, nuevoValor); 
        }catch (error){
            console.log(error);
        }

        let filter = (m) => m.author.id == message.author.id; //Obtengo el id del usuario que ejecutó el comando, para solo colectar sus mensajes
        let collector = new discord.MessageCollector(message.channel, { filter, max: 1 }); //Se colectará como máximo 1 mensaje del usuario

        collector.on("collect", (msg) => {

            const row = new discord.MessageActionRow();

            let roles = msg.content.split(", "); //Almaceno en un array los roles que escribió el usuario

            try{
                for(var i = 0; i < roles.length; i++){ //Recorro el array y busco el ID para cada nombre de rol que dio el usuario

                    let rol = message.guild.roles.cache.find(r => r.name === roles[i]);
                    console.log(`ROL: ${roles[i]} // ID: ${rol.id}`);
    
                    row.addComponents(
                        [
                        new discord.MessageButton()
                        .setCustomId(`${roles[i]}`)
                        .setLabel(`${roles[i]}`)
                        .setStyle("PRIMARY")
                        ]
                    );
                }

                const embed2 = new discord.MessageEmbed()
                .setTitle("ELEGÍ TUS ROLES CLICKEANDO EN LOS BOTONES DE ABAJO")
                .setColor("GREEN");

                message.channel.send({ embeds: [embed2], components: [row] });
            }catch(error){
                message.channel.send(`**Ocurrió un error:** asegurate de estar escribiendo correctamente el nombre de todos los roles y de separarlos con una coma y espacio.\n
                                    **Ejemplo:** Rojo, Azul, Verde\n\n
                                    *Error: ${error}*`);
                console.log(error);
            }   
        
        });

    }
}
