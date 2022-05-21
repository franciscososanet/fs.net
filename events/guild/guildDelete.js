const colors = require("colors");
const dataServerModel = require("../../schemas/dataServer");

module.exports = async (client, discord, guild)  => { //Este evento se ejecuta al bot abandonar un servidor

    let serverData = await dataServerModel.findOne({ serverID: guild.id  });

    if(serverData){ 
        await dataServerModel.deleteOne({serverID: serverData.serverID });
    }
} 


