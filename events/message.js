module.exports = async (client, message) => {
    if (message.author.bot) return;

    const settings = message.settings = client.getSettings(message.guild.id);

    // Return guild prefix if bot is mentioned without message
    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
        return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
    }

    if (message.content.indexOf(settings.prefix) !== 0) return;

    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // If the member on a guild is invisible or not cached, fetch them.
    if (message.guild && !message.member) await message.guild.fetchMember(message.author);

    // Get guild member's permission level
    const level = client.permlevel(message);

    // Check whether the command or alias of the command exist
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    // Ignore the command silently if it doesn't exist
    if (!cmd) return;

    // Check if command can be used in DMs
    if (cmd && !message.guild && cmd.conf.guildOnly)
        return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

    if (level < client.levelCache[cmd.conf.permLevel]) {
        if (settings.systemNotice === true) {
            return message.channel.send(`You do not have permission to use this command.
            Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
            This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
        } else {
            return;
        }
    }

    // Set permission level in author object
    message.author.permLevel = level;

    // Collect flags (if any) into message object
    message.flags = [];
    while (args[0] && args[0][0] === "-") {
        message.flags.push(args.shift().slice(1));
    }

    // Log and Run command after all checks
    client.logger.cmd(`${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
    cmd.run(client, message, args, level);
};
