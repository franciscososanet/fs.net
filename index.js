require("dotenv").config();

const discord = require("discord.js");
const intents = new discord.Intents();
const client = new discord.Client({ intents: 32767 });


//CONECTAR MONGODB
const mongoose = require("mongoose");

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("--------------------- LOGS DEL BOT ---------------------");
    console.log("** Conectado a MongoDB **");
}).catch((error) => {
    console.log("ERROR AL CONECTARSE A MONGODB: " + error);
});


// CARGAR HANDLERS
client.commands = new discord.Collection();
client.events = new discord.Collection();
client.slash = new discord.Collection();

["commandHandler", "eventHandler"].forEach((file) => {
    require(`./handlers/${file}`)(client, discord);
  });


//CONECTAR BOT
client.login(process.env.DSTOKEN);


/*


//SNIPESCHEMA.JS
client.on("messageDelete", async(message) => {
    const snipe = require ("./schemas/snipeSchema.js");

    let data = await snipe.findOne({ channelId: message.channelId });
    
    if(!data){
        let newdata = new snipe({
            channelId: message.channel.id,
            message: message.content,
            author: message.author.tag,
            time: Math.floor(Date.now() / 1000)
        });
    
    return await newdata.save();
    }

    await snipe.findOneAndUpdate({
        channelId: message.channel.id,
        message: message.content,
        author: message.author.tag,
        time: Math.floor(Date.now() / 1000)
    });
});

const fs = require("fs");
let { readdirSync } = require("fs");
const { fileURLToPath } = require("url");

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./comandos").filter(file => file.endsWith(".js"));

for (const file of commandFiles){
    const command = require(`./comandos/${file}`);
    client.commands.set(command.name, command);
}

//COMMAND HANDLER PARA SLASH COMMANDS
client.slashcommands = new Discord.Collection();
const slashcommandsFiles = fs.readdirSync("./slashCommands").filter(file => file.endsWith(".js"));

for (const file of slashcommandsFiles){
    const slash = require(`./slashCommands/${file}`);
    console.log(`Slash command: ${file} cargado`);
    client.slashcommands.set(slash.data.name, slash);
}


client.on("interactionCreate", async(interaction) => {
    

    if(interaction.isCommand() || interaction.isContextMenu()){
        const slashcmds = client.slashcommands.get(interaction.commandName);

        if(!slashcmds) return;
        
        try{
            await slashcmds.run(client, interaction);
        }catch(e){
            console.error(e);
        }
    }
});


//CANVAS
client.on("guildMemberAdd", async (member) => {
    if(member.guild.id === "271465017029689344"){
        const Canvas = require("canvas");
        const canvas = Canvas.createCanvas(1018, 468);
        const ctx = canvas.getContext("2d");
        const background = await Canvas.loadImage("https://e7.pngegg.com/pngimages/692/798/png-clipart-hot-dog-hot-dog.png");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        //Propiedades del texto
        ctx.fillStyle = "#ffffff";
        ctx.font = "100px Arial";
        ctx.fillText("Bienvenido", 460, 260);
        ctx.fillText(`${member.user.username}`, 460, 340);

        //Circular avatar del usuario
        ctx.beginPath();
        ctx.arc(247, 238, 175, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip(); 

        const avatarUsuario = await Canvas.loadImage(member.user.displayAvatarURL({ size: 1024, dynamic: true }));
        ctx.drawImage(avatarUsuario, 72, 63, 350, 350);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "bienvenida.png");
        client.channels.cache.get("960257433916276896").send({files: [attachment] });
    }
});

*/
