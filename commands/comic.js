const request = require('../modules/asyncRequest');

exports.run = async (client, message, args, level) => {
    const comic = Math.floor(Math.random() * 2000) + 1; // Rough estimate of total number of comics from site
    const options = {
        method: 'GET',
        url: `http://xkcd.com/${comic}/info.0.json`
    };

    let body;
    try {
        body = await request(options);
        body = JSON.parse(body);
    } catch(err) {
        return client.logger.error(err);
    }

    message.channel.send(body.img);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "comic",
    category: "Miscelaneous",
    description: "Send a random comic from xkcd.com",
    usage: "comic"
};
