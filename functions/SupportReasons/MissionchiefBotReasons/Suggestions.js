const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const pool = require('../../../data/MySQL/database');

async function sendMissionchiefSuggestionMessage(interaction) {
    const ticketNumber = interaction.channel.name.match(/ticket-(\d+)/)[1];
    const query = 'SELECT user_id FROM tickets WHERE ticket_id = ?';
    const [results] = await pool.promise().query(query, [ticketNumber]);
    const userId = results[0].user_id;

    const embed = new EmbedBuilder()
        .setTitle('Missionchief Suggestions')
        .setDescription("If you would like to make a suggestion on how we can improve and enhance our bot, feel free to let me know here and we will try our best to implement it.");
    await interaction.update({ embeds: [embed], components: [] });
    await interaction.channel.setName(`Missionchief-Suggestions-${ticketNumber}`);
    await interaction.channel.permissionOverwrites.edit(userId, {
        [PermissionsBitField.Flags.SendMessages]: true
    });    
}

module.exports = { sendMissionchiefSuggestionMessage };
