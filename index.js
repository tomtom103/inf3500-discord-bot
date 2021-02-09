const { Client, MessageEmbed } = require('discord.js');

require('dotenv').config();

const bot = new Client();

const TOKEN = process.env.TOKEN

bot.login(TOKEN);

const roles = ["répétiteurs", "chargés-labos", "prof"]

const allowed_users = [
    { username: 'thom', discriminator: '3270'},
    { username: 'Pierre Langlois', discriminator: '4976'},
];

const emojis = [
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

function verifyCommandPermission(msg) {
    return (msg.member.roles.cache.some(role => roles.includes(role.name)) || allowed_users.find(user => {
        return user.username === msg.author.username && user.discriminator === msg.author.discriminator;
    }));
}

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}`);
});

bot.on('message', msg => {
    if(msg.content.startsWith('!ping')) {
        if(verifyCommandPermission(msg)) {
            msg.delete();
            msg.channel.send("PONG");
        }
    }
})

bot.on('message', msg => {
    if(msg.content.startsWith('!syntax')) {
        if(verifyCommandPermission(msg)) {
            msg.channel.send("Syntax: \n\n!poll Voici le titre\nVoici la première option\nDeuxieme Option\nTroisieme Option");
        }
    }
})

bot.on('message', (message) => {
    if(message.content.startsWith('!poll')) {
        if(verifyCommandPermission(message)) {
            let args = message.content.split('\n');
            args[0] = args[0].replace('!poll', '').trim();
            if(args.length > 1) {
                let title = args.shift();
                message.delete();
                const embed = new MessageEmbed()
                .setTitle(title)
                .setColor(0x00AE86);

                var embedString = "";

                emojis.slice(0, args.length).forEach((item, index) => {
                    embedString += ':' + item.name + ':' + ' : ' + args[index] + '\n\n';
                });

                embed.addField("Choix", "\n\n" + embedString);

                message.channel.send(embed)
                .then((msg) => {
                    emojis.slice(0, args.length).forEach(item => {
                        msg.react(item.value);
                    })
                })
                .catch((err) => {
                    console.log(err);
                });

            } else if(args.length > emojis.length + 1) {
                message.channel.send('Too many choices! Currently supported max is: ' + emojis.length);
            }
            
            else  {
                message.channel.send('Too few arguments to call function (need at least title and 1 choice');
            }
        }
    }
})

const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('ok');
});

server.listen(3000);
