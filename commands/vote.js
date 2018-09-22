const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = (client, message, args, level) => {
    if (args.length < 1) return message.reply("Please include the vote title.");

    const response = new Discord.RichEmbed();
    const validEmojis = ["👍", "👎", "✋"];
    const title = args.join(" ")  + "\n";
    const pollText = ":thumbsup: - Yes\n\n:thumbsdown: - No\n\n:raised_hand: - No Vote\n\n";

    response.setColor([242, 214, 133]);
    response.setTitle(title);
    response.setFooter(`Created by ${message.author.username}`);
    response.setTimestamp(new Date());
    response.addField("\u200b", pollText, false);

    message.channel.send(response)
    .then(async message => {
        for(let i = 0; i < 3; i++) {
            await message.react(validEmojis[i]);
        }

        const filter = (reaction, user) => !validEmojis.includes(reaction.emoji.name) && reaction.remove(user);
        const timeout = 1000 * 60 * 60 * 24; // 24 hours
        const duration = moment.duration(timeout).format(" D [days], H [hrs], m [mins], s [secs]");
        const collector = message.createReactionCollector(filter, { time: timeout });

        client.logger.cmd("Reaction collector started for " + duration);
    });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "vote",
    category: "Miscelaneous",
    description: "Start a voting poll",
    usage: "vote <vote title>"
};
