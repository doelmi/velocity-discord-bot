const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    let splittedMessage = msg.content.split(" ");
    let command = splittedMessage[0];
    switch (command) {
        case 've!hallo':
            msg.channel.send(`Hi <@${msg.author.id}>`);
            break;
    
        case 've!ily':
            msg.channel.send(`Dear <@${msg.author.id}>, I love you too so much. 😘`);
            break;
        
        case 've!o':
        case 've!operate':
            msg.channel.send(`${splittedMessage[1]} = ${eval(splittedMessage[1])}`);
            break;
    
        default:
            break;
    }
});

client.login('NzcwNjQ4OTc3MDUzNTgxMzUz.X5goyg.qFK14bGb_XuPLn-YzM7KYL2NQmY');
