module.exports = { 
    name: "say",
    description: "repetir lo q diga",

    async execute(client, message, args, discord) {

        const mensaje = args.join(" ");
        if(!mensaje) return message.channel.send("Escribi algo, boludito");

        setTimeout(() => {
            message.delete();
            message.channel.send(`${mensaje}`) 
        }, 1000);
    }
}