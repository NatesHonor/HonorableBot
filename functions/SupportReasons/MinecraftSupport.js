const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

async function handleMinecraftSupport(interaction) {
    const options = [
        { label: 'Appeal a Punishment', value: 'appeal_a_punishment' },
        { label: 'Report a Bug', value: 'report_a_bug' },
        { label: 'Technical Support', value: 'technical_support' },
        { label: 'Lost Items/Progress', value: 'lost_items' },
        { label: 'Billing Support', value: 'billing_support' },
        { label: 'Report A User', value: 'report_a_user' },
        { label: 'Feedback and Suggestions', value: 'feedback_and_suggestions' },
        { label: 'Account Recovery and Security', value: 'account_recovery_and_security' },
        { label: 'General Support', value: 'general_support' },
        { label: 'Other', value: 'other' },
    ];

    const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('select_specific_reason')
                .setPlaceholder('Choose a specific reason')
                .addOptions(options),
        );

    await interaction.update({ content: 'Choose a specific reason:', components: [row] });
}

module.exports = { handleMinecraftSupport };
