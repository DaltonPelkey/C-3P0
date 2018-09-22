const request = require('../modules/asyncRequest');

exports.run = async (client, message, args, level) => {
    const options = {
        method: 'GET',
        url: 'https://icanhazdadjoke.com/',
        headers: {
            Accept: 'application/json'
        }
    };

    let body;
    try {
        body = await request(options);
        body = JSON.parse(body);
    } catch(err) {
        return client.logger.error(body)
    }

    message.reply(body.joke);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "dadjoke",
    category: "Miscelaneous",
    description: "Replies with a random dad joke from icanhazdadjoke.com",
    usage: "dadjoke"
};
