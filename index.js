require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

// Bot secret key, must be contained in a .env file in the same directory
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

const roles = ["répétiteurs", "chargés-labos", "prof"]

// The string is used for the text part, and the emoji is used for the raection.
// You can copy and paste different emojis from https://getemoji.com/
const emojis = {
  circles: [
    { name: 'red_circle', value: '🔴'},
    { name: 'green_circle', value: '🟢'},
    { name: 'yellow_circle', value: '🟡'},
    { name: 'blue_circle', value: '🔵'},
    { name: 'orange_circle', value: '🟠'},
    { name: 'purple_circle', value: '🟣'},
    { name: 'red_square', value: '🟥'},
    { name: 'green_square', value: '🟩'},
    { name: 'yellow_square', value: '🟨'},
    { name: 'blue_square', value: '🟦'},
    { name: 'orange_square', value: '🟧'},
    { name: 'purple_square', value: '🟪'}
  ]
}

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if(msg.content.startsWith('!syntax')) {
    msg.delete();
    msg.channel.send(`Syntax: \n !poll "Ici va le titre" [Première option | Deuxième Option]`)
  }
});

bot.on('message', msg => {
  if(msg.content) {
    // Array with: anything in brackets, anything in quotes, anything separated by spaces (in that hierarchy)
    var args = msg.content.trim().match(/(?:[^\s"\[]+|\[[^\[]*\]|"[^"]*")+/g);
    if(args[0].toLowerCase() == '!poll') {
      if(msg.member.roles != null) {
        if(msg.member.roles.some(role => roles.includes(role.name))) {
          args.shift();
          msg.delete();
          if(
            args.length > 1 &&
            args[0].charAt(0) === '"' &&
            args[0].charAt(args[0].length - 1) === '"' &&
            args[1].charAt(0) === '[' &&
            args[1].charAt(args[1].length - 1) === ']' 
          ) {
            var title = args.shift().slice(1, -1);
            var choices = args.shift().slice(1,-1).split('|').map(Function.prototype.call, String.prototype.trim);
    
            const embed = new Discord.RichEmbed()
            .setTitle(title)
            .setColor(0x00AE86);
    
            var embedString = "";
            
            emojis.circles.slice(0, choices.length).forEach((item, index) => {
              embedString += ':' + item.name + ':' + ' : ' + choices[index] + '\n\n';
            })
    
            embed.addField("Choix", "\n" + embedString)
    
            msg.channel.send(embed)
            .then((message) => {
              emojis.circles.slice(0, choices.length).forEach(item => {
                message.react(item.value)
              })
            })
            .catch((err) => {
              console.log(err);
            })
          }
        }
      } else {
        msg.channel.send("Hmmm... you seem to be missing some arguments. Try !syntax to view the syntax")
      }
    }
  }
});
