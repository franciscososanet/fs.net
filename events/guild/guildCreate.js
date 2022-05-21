const colors = require("colors");
const dataServerModel = require("../../schemas/dataServer");

module.exports = async (client, discord, guild)  => { //Este evento se ejecuta al bot entrar a un nuevo servidor

    let serverData = await dataServerModel.findOne({ serverID: guild.id  });

    if(serverData){ 
        console.log(colors.green(`EL SERVER "${guild.name}" (${guild.id}) YA SE ENCONTRABA REGISTRADO`));
    }else{
        try{
            let data = await dataServerModel.create({
                serverID: guild.id,
                serverName: guild.name,
                channelAutoRol: null,
                messageAutoRol: null,
                rolName: null,
                rolID: null
            });
            data.save();

        }catch(e){
            console.log(e);
        }
    }

    let serverOwner = await guild.fetchOwner();
    serverOwner.send("Gracias por invitarme al server")
} 


