module.exports = async (client, discord, message) => {

    const snipe = require ("../../schemas/snipeSchema.js");

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

};