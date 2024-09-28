const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder } = require('discord.js');

async function handleMissionchiefBotSupport(interaction) {
    const options = [
        { label: 'Bug Reports', value: 'bug_reports' },
        { label: 'Suggestions', value: 'suggestions' },
    ];

    const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('select_missionchief_support')
                .setPlaceholder('Choose a specific reason')
                .addOptions(options),
        );

    const embed = new EmbedBuilder()
        .setTitle('Missionchief Support')
        .setDescription('In order to understand which type of support you need for our Missionchief Bot, select if you\'d like to report a Bug or a Suggestion.');

    await interaction.update({ embeds: [embed], components: [row] });
}

module.exports = { handleMissionchiefBotSupport };
