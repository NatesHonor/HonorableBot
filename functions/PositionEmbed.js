const { EmbedBuilder } = require('discord.js');
function createPositionEmbed() {


    const embed = new EmbedBuilder()
        .setTitle('Current Open Positions')
        .setColor(0x0099FF)
        .addFields(
            { name: 'Game Master', value: 'Positions: 2' },
            { name: '\u200B', value: '\u200B' },
            { name: 'Contractor', value: 'Positions: 4', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Moderator', value: 'Positions: 2', inline: true },
            { name: 'Helper', value: 'Positions: 2', inline: true },
        )
        .setFooter({text: 'Updated'})
        .setTimestamp();
    return embed;
}

module.exports = { createPositionEmbed };