const discord = require("discord.js");

module.exports = async (client) => {

    console.log(`- BOT ${client.user.username} ESTÁ EN LINEA`);

    //AUTOROLES
    client.channels.cache.get("968319961619636305").messages.fetch("968321292828831874").then(msg => {
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
        let user = "juansguarnizo";

        const uptime = await fetch.get(`https://decapi.me/twitch/uptime/${user}`);
        const avatar = await fetch.get(`https://decapi.me/twitch/avatar/${user}`);
        const viewers = await fetch.get(`https://decapi.me/twitch/viewercount/${user}`);
        const title = await fetch.get(`https://decapi.me/twitch/title/${user}`);
        const game = await fetch.get(`https://decapi.me/twitch/game/${user}`);

        const twitch = require("../../schemas/twitchSchema.js");

        let data = await twitch.findOne({ user: user, titulo: title.body });

        if(uptime.body !== `${user} is offline`){

            const embed = new discord.MessageEmbed()
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

                await client.channels.cache.get("968401302059098134").send({ content: `${user} **está stremeando.**\nhttps://twitch.tv/${user}`, embeds: [embed] });
                return await newdata.save();
            }

            if(data.titulo === `${title.body}`) return;
            await client.channels.cache.get("968401302059098134").send({ content: `${user} **está stremeando.**\nhttps://twitch.tv/${user}`, embeds: [embed] });
            await twitch.findOneAndUpdate({ user: user }, { titulo: title.body });
        }
    }, 60000);

};
