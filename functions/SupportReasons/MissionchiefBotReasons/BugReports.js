const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const pool = require('../../../data/MySQL/database');

async function sendMissionchiefBugReportMessage(interaction) {
    const ticketNumber = interaction.channel.name.match(/ticket-(\d+)/)[1];
    const query = 'SELECT user_id FROM tickets WHERE ticket_id = ?';
    const [results] = await pool.promise().query(query, [ticketNumber]);
    const userId = results[0].user_id;

    const embed = new EmbedBuilder()
        .setTitle('Missionchief Bot Bug Reports')
        .setDescription("If you would like to make a bug report on a software breaking issue go ahead and leave a message below and we will fix it as soon as we can.");
    await interaction.update({ embeds: [embed], components: [] });
    await interaction.channel.setName(`Missionchief-Bug-${ticketNumber}`);
    await interaction.channel.permissionOverwrites.edit(userId, {
        [PermissionsBitField.Flags.SendMessages]: true
    });    
}

module.exports = { sendMissionchiefBugReportMessage };
