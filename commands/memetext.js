exports.run = (client, message, args, level) => {
    if (args.length < 1) return message.reply("You have to give me some text to meme-ify, silly :P");

    message.delete()
    .then(msg => msg.channel.send(memeText(args.join(" "))));
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "memetext",
    category: "Miscelaneous",
    description: "StUpIfY YoUr tExT",
    usage: "memetext <message>"
};

function memeText (input) {
    var res = "";
    for (i=0; i < input.length; i++) {
        res += i % 2 == 0 ? input.charAt(i).toUpperCase() : input.charAt(i);
    }
    return res;
}
