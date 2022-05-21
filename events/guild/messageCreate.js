require("dotenv").config();
const prefix = process.env.PREFIX;
const dataServerModel = require("../../schemas/dataServer");

module.exports = async (client, discord, message) => {

  //INICIO AUTOROLES
  setInterval(async function(){

    try{
      let queryIdServer = await dataServerModel.findOne({ "serverID": message.guild.id  });

      if(message.id === queryIdServer.messageAutoRol ){
    
        clearInterval(this);

        let query = await dataServerModel.find({ "serverID": `${message.guild.id}` });

        var arrayNombres = query[0].rolName.split(",");
        var arrayIds = query[0].rolID.split(",");

        await CrearAutoRol(
          query[0].channelAutoRol,
          query[0].messageAutoRol,
          arrayNombres,
          arrayIds
        );
      }
    }catch(e){
      console.log(e);
    }
  }, 1000);


  async function CrearAutoRol(idCanalRol, idMensajeRol, nombreRoles, idRoles){

    if(idCanalRol !== null && idMensajeRol !== null && nombreRoles!== null && idRoles !== null){
     
      client.channels.cache.get(idCanalRol).messages.fetch(idMensajeRol).then(msg => {

        let ifilter = i => !i.user.bot;
        const collector = msg.createMessageComponentCollector({ filter: ifilter });

        collector.on("collect", async i => {

          let x = idRoles.find(el => el == i.customId);

          if(!i.member.roles.cache.has(x)){
            await i.member.roles.add(x);
            i.reply({ content: `Rol <@&${x}> añadido`, ephemeral: true });
          }else{
            await i.member.roles.remove(x);
            i.reply({ content: `Rol <@&${x}> removido`, ephemeral: true });
          }     
        });

      });


    }else{
      console.log("ALGO FALTA POR CONFIGURAR!!!");
    }
  }
  //FIN AUTOROLES

  if(message.channel.type === "dm") return;
  if(message.author.bot) return;
  if(!message.content.startsWith(prefix)) return;


  const args = message.content.slice(prefix.length).split(/ +/);
  const cmd = args.shift().toLowerCase();
  const command = client.commands.get(cmd);

  if (command) {
    command.execute(client, message, args, discord);
  }else{ //SI EL COMANDO NO EXISTE...
    if (!command){
        const embed = new discord.MessageEmbed()
        .setTitle("Comando no encontrado")
        .setDescription(`El comando "${command}" no existe`)
        .setColor("RED")
        .setTimestamp();

        message.channel.send({ embeds: [embed] });
      } 
  }
};