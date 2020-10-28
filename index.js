require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');
const moment = require('moment');
var numeral = require('numeral');

// load a locale
numeral.register('locale', process.env.APP_LOCALE, {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'ribu',
        million: 'juta',
        billion: 'milyar',
        trillion: 'bilyar'
    },
    ordinal : function (number) {
        return number === 1 ? 'satu' : 'se';
    },
    currency: {
        symbol: 'Rp'
    }
});
numeral.locale(process.env.APP_LOCALE);

moment.locale(process.env.APP_LOCALE)
let embed

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

function getMentionedUsers(message) {
    let mentionUsers = [];
    for (const [key, user] of message.mentions.users) {
        mentionUsers.push(user);
    }
    return mentionUsers;
}

client.on('message', msg => {
    try {
        let splittedMessage = msg.content.toLowerCase().split(" ");
        let command = splittedMessage.shift();
        let params = splittedMessage;
        let joinedParams = params.join(" ");
        let mentionUser = getMentionedUsers(msg);
        switch (command) {
            case 've!h':
            case 've!halo':
            case 've!hello':
            case 've!hallo':
                msg.channel.send(`Hi <@${msg.author.id}>`);
                break;
            case 've!ily':
                msg.channel.send(`<@${msg.author.id}>, I love you too`);
                break;
            case 've!covid':
                if(joinedParams.trim().length > 0) {
                    embed = new Discord.MessageEmbed()
                    embed.setDescription(`https://indonesia-covid-19.mathdro.id/api/provinsi/`)
                    .setTimestamp()
                    .setFooter(`Diminta oleh ${msg.author.tag}`, msg.author.displayAvatarURL);
                    axios.get('https://indonesia-covid-19.mathdro.id/api/provinsi/').then(resp => {
                        let dataProv = resp.data.data.find(o => o.provinsi.toLowerCase().includes(joinedParams));
                        if(!dataProv) {
                            msg.channel.send(`_Provinsi tidak ditemukan_`);
                        } else {
                            embed.setTitle(`Covid19 Data Provinsi ${dataProv.provinsi}`)
                            embed.addField(`Kasus Positif`, `${numeral(dataProv.kasusPosi).format('0,0')}`)
                            embed.addField(`Kasus Sembuh`, `${numeral(dataProv.kasusSemb).format('0,0')}`)
                            embed.addField(`Kasus Meniggal`, `${numeral(dataProv.kasusMeni).format('0,0')}`)
                            msg.channel.send(embed);
                        }
                    });
                } else {
                    embed = new Discord.MessageEmbed()
                    embed.setTitle(`Covid19 Data Indonesia`)
                    .setDescription(`https://indonesia-covid-19.mathdro.id/api/`)
                    .setTimestamp()
                    .setFooter(`Diminta oleh ${msg.author.tag}`, msg.author.displayAvatarURL);
                    axios.get('https://indonesia-covid-19.mathdro.id/api/').then(resp => {
                        embed.addField(`Dalam Perawatan`, `${numeral(resp.data.perawatan).format('0,0')}`)
                        embed.addField(`Sembuh`, `${numeral(resp.data.sembuh).format('0,0')}`)
                        embed.addField(`Meniggal`, `${numeral(resp.data.meninggal).format('0,0')}`)
                        embed.addField(`Jumlah Kasus`, `${numeral(resp.data.jumlahKasus).format('0,0')}`)
                        embed.addField(`Update Terakhir`, `${moment(resp.data.lastUpdate).format('LLL')}`)
                        msg.channel.send(embed);
                    });
                }
                break;
            case 've!slap':
            case 've!tampol':
                if(mentionUser.length === 0) {
                    msg.channel.send(`_Tolong sebutkan pengguna yang ditampol (Bukan bot/role)_`);
                    break;
                }
                embed = new Discord.MessageEmbed()
                embed.setTitle(`${msg.author.tag} nampol ${mentionUser[0].tag}`)
                .setTimestamp()
                .setFooter(`Diminta oleh ${msg.author.tag}`, msg.author.displayAvatarURL);
                axios.get('https://api.giphy.com/v1/gifs/random?api_key=2SGCA3ZDFEkHAORpAr49jza5P1KX8l9e&tag=slap&limit=1&rating=g').then(resp => {
                    embed.setImage(`${resp.data.data.images.original.url}`);
                    msg.channel.send(embed);
                });
                break;
            case 've!kiss':
            case 've!cium':
                if(mentionUser.length === 0) {
                    msg.channel.send(`_Tolong sebutkan pengguna yang dicium (Bukan bot/role)_`);
                    break;
                }
                embed = new Discord.MessageEmbed()
                embed.setTitle(`${msg.author.tag} cium ${mentionUser[0].tag}`)
                .setTimestamp()
                .setFooter(`Diminta oleh ${msg.author.tag}`, msg.author.displayAvatarURL);
                axios.get('https://api.giphy.com/v1/gifs/random?api_key=2SGCA3ZDFEkHAORpAr49jza5P1KX8l9e&tag=kiss&limit=1&rating=g').then(resp => {
                    embed.setImage(`${resp.data.data.images.original.url}`);
                    msg.channel.send(embed);
                });
                break;
            case 've!lapar':
            case 've!laper':
            case 've!makan':
                embed = new Discord.MessageEmbed()
                embed.setTitle(`Nih makan ${msg.author.tag}!`)
                .setTimestamp()
                .setFooter(`Diminta oleh ${msg.author.tag}`, msg.author.displayAvatarURL);
                axios.get('https://api.giphy.com/v1/gifs/random?api_key=2SGCA3ZDFEkHAORpAr49jza5P1KX8l9e&tag=food&limit=1&rating=g').then(resp => {
                    embed.setImage(`${resp.data.data.images.original.url}`);
                    msg.channel.send(embed);
                });
                break;
            case 've!assignvoucher50k':
                if (msg.author.tag !== process.env.DISCORD_BOT_OWNER_TAG) {
                    msg.channel.send(`_Kamu tidak bisa menggunakan perintah ini_`);
                    break;
                }
                axios.get('http://10.15.3.179/prod/POS/scheduler/assignPromoVoucher50K').then(resp => {
                    msg.channel.send(`${resp.data}`);
                });
                break;
            case 've!bkc':
                if (msg.author.tag !== process.env.DISCORD_BOT_OWNER_TAG) {
                    msg.channel.send(`_Kamu tidak bisa menggunakan perintah ini_`);
                    break;
                }
                embed = new Discord.MessageEmbed()
                embed.setTitle(`Cari Toko di Bisnis Kokoh : ${params[0]}`)
                .setTimestamp()
                .setFooter(`Diminta oleh ${msg.author.tag}`, msg.author.displayAvatarURL);
                axios.post('https://3pl.sig.id/Api_distr_poin/data_toko_aktif_kdcustomer', { kdcustomer: params[0]}).then(resp => {
                    if(resp.data.data.status === 'empty') {
                        msg.channel.send(`_${resp.data.data.info}_`);
                    } else {
                        let store = resp.data.data.data[0]
                        embed.addField(`Kode Toko`, store.KD_CUSTOMER)
                        .addField(`Nama Toko`, store.NAMA_TOKO)
                        .addField(`Nama Pemilik Toko`, store.NM_CUSTOMER)
                        .addField(`Alamat Toko`, store.ALAMAT_TOKO)
                        .addField(`No Handphone`, store.NO_HANDPHONE)
                        .addField(`Distributor 1`, `${store.DISTRIBUTOR} (${store.NOMOR_DISTRIBUTOR})`)
                        .addField(`Distributor 2`, `${store.DISTRIBUTOR2} (${store.NOMOR_DISTRIBUTOR2})`)
                        .addField(`Distributor 3`, `${store.DISTRIBUTOR3} (${store.NOMOR_DISTRIBUTOR3})`)
                        .addField(`Distributor 4`, `${store.DISTRIBUTOR4} (${store.NOMOR_DISTRIBUTOR4})`)
                        msg.channel.send(embed);
                    }
                });
                break;
            default:
                break;
        }
    } catch (error) {
        msg.channel.send(`Error : ${error}`);
    }

});

client.login(process.env.DISCORD_BOT_TOKEN);
