require("dotenv").config();
const prefix = process.env.PREFIX;

module.exports = async (client, discord, message) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
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