const config = require('../config.json');

async function onMessageReactionAdd(reaction, user, client) {
    if (user.bot || reaction.message.id !== config.verificationMessageID || reaction.emoji.name !== '✅') return;

    try {
        await reaction.users.remove(user.id);

        const guild = reaction.message.guild;
        if (!guild) return;
        const member = await guild.members.fetch(user.id);
        const verifiedRole = await guild.roles.fetch(config.verifiedRole);
        if (!member || !verifiedRole) {
            console.error('Member or verified role not found.');
            return;
        }
        await member.roles.add(verifiedRole);
        console.log(`User ${user.tag} has been verified and given the ${verifiedRole.name} role.`);
    } catch (error) {
        console.error('Error handling reaction:', error);
    }
}

