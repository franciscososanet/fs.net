const discord = require("discord.js");

module.exports = async (client, discord, member)  => {

    //BIENVENIDA CON CANVAS
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

        const attachment = new discord.MessageAttachment(canvas.toBuffer(), "bienvenida.png");
        client.channels.cache.get("968417680598118440").send({files: [attachment] });
    }

};