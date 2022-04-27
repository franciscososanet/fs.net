const discord = require("discord.js");

module.exports = {
    
    name: "pregunta",
    description: "Responde aleatoriamente a una pregunta",

    execute(client, message, args){

        const pregunta = args.join(" ");

        if(!pregunta) return message.channel.send("Escribi una preguna, zapato");
        
        let respuestas = ["Si", "No", "Probablemente"];
        let random = respuestas[Math.floor(Math.random() * respuestas.length)];

        const embed = new discord.MessageEmbed()
        .setTitle("titulow")
        .setDescription(`A tu pregunta:\n**${pregunta}**\n\nMi respuesta es:\n**${random}**`);

        message.channel.send({ embeds: [embed] });
    }    
}