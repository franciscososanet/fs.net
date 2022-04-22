const Discord = require("discord.js");
const intents = new Discord.Intents();
const client = new Discord.Client({ intents: 32767 });
const mongoose = require("mongoose");
require("dotenv").config();

client.on("ready", async() => {
    console.log("BOT ENCENDIDO");

    //AUTOROLES
    client.channels.cache.get("960257433916276896").messages.fetch("963174093434261534").then(msg => {
        let ifilter = i => !i.user.bot;
        const collector = msg.createMessageComponentCollector({ filter: ifilter })

        collector.on("collect", async i => {
            if(i.customId === "hombra"){
                if(!i.member.roles.cache.has("917452809329332234")){
                    await i.member.roles.add("917452809329332234");
                    i.reply({ content: "Rol <@&917452809329332234> añadido", ephemeral: true });
                }else{
                    i.reply({ content: "Ya tenés el rol <@&917452809329332234>, salame", ephemeral: true });
                }
            }

            if(i.customId === "mujero"){
                if(!i.member.roles.cache.has("917453572231270441")){
                    await i.member.roles.add("917453572231270441");
                    i.reply({ content: "Rol <@&917453572231270441> añadido", ephemeral: true });
                }else{
                    i.reply({ content: "Ya tenés el rol <@&917453572231270441>, salame", ephemeral: true });
                }
            }

        });
    });

    //NOTIFICACIONES TWITCH
    setInterval(async function(){
        const fetch = require("node-superfetch");
        let user = "carola";

        const uptime = await fetch.get(`https://decapi.me/twitch/uptime/${user}`);
        const avatar = await fetch.get(`https://decapi.me/twitch/avatar/${user}`);
        const viewers = await fetch.get(`https://decapi.me/twitch/viewercount/${user}`);
        const title = await fetch.get(`https://decapi.me/twitch/title/${user}`);
        const game = await fetch.get(`https://decapi.me/twitch/game/${user}`);

        const twitch = require("./schemas/twitchSchema.js");

        let data = await twitch.findOne({ user: user, titulo: title.body });

        if(uptime.body !== `${user} is offline`){

            const embed = new Discord.MessageEmbed()
            .setAuthor({ "name": `${user}`, "iconURL": `${avatar.body}` })
            .setTitle(`${title.body}`)
            .setThumbnail(`${avatar.body}`)
            .setURL(`https://twitch.tv/${user}`)
            .addField("Game", `${game.body}`, true)
            .addField("Viewers", `${viewers.body}`, true)
            .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${user}-620x378.jpg`)
            .setColor("BLURPLE");

            if(!data){
                const newdata = new twitch({
                    user: user,
                    titulo: `${title.body}`
                });

                await client.channels.cache.get("960257433916276896").send({ content: `${user} **está stremeando.**\nhttps://twitch.tv/${user}`, embeds: [embed] });

                return await newdata.save();
            }

            if(data.titulo === `${title.body}`) return;

            await client.channels.cache.get("960257433916276896").send({ content: `${user} **está stremeando.**\nhttps://twitch.tv/${user}`, embeds: [embed] });

            await twitch.findOneAndUpdate({ user: user }, { titulo: title.body });
        }

    }, 60000);

});

//MONGODB
mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("CONECTADO A MONGODB");
}).catch((error) => {
    console.log("ERROR AL CONECTARSE A MONGODB: " + error);
});

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
const slashcommandsFiles = fs.readdirSync("./slashcmd").filter(file => file.endsWith(".js"));

for (const file of slashcommandsFiles){
    const slash = require(`./slashcmd/${file}`);
    console.log(`Slash command: ${file} cargado`);
    client.slashcommands.set(slash.data.name, slash);
}

//TICKETS
client.on("interactionCreate", async(interaction) => {
    if(interaction.isButton()){
        if(interaction.customId === "tickets"){
            const everyone = interaction.guild.roles.cache.find(r => r.name === "@everyone");
            interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
                type: "GUILD_TEXT",
                parent: "964272478958530611",
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                    },
                    {
                        id: everyone.id,
                        deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                    }
                ]
            }).then(c => {
                const mensaje = new Discord.MessageEmbed()
                    .setTitle(`${interaction.user.username}, este es tu ticket`)
                    .setDescription("Escribe tu duda/pregunta/queja.\nSé paciente y espera por un moderador.")
                    .setColor("RANDOM");

                c.send({ embeds: [mensaje] });
            });    

            interaction.reply({ content: `<@${interaction.user.id}>, tu ticket ha sido creado.`, ephemeral: true });
        }
    }

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

client.on("messageCreate", (message) => {

    let prefix = process.env.PREFIX;

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(!message.content.startsWith(prefix)) return;

    let usuario = message.mentions.members.first() || message.member;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let cmd = client.commands.find((c) => c.name === command || c.alias && c.alias.includes(command));

    if (cmd){
        cmd.execute(client, message, args);
    }

    if(!cmd){
        if(message.content === prefix) return;

        const embed = new Discord.MessageEmbed()
        .setTitle("Comando no encontrado")
        .setDescription(`El comando "${command}" no existe`)
        .setColor("RED")
        .setTimestamp();

        message.channel.send({ embeds: [embed] });
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

client.login(process.env.DSTOKEN);
