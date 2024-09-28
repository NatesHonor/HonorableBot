const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'ticket',
        description: 'Create a new ticket',
    },

    async execute(interaction) {
        console.log('Ticket command triggered');

        const createButton = new ButtonBuilder()
            .setCustomId('confirm_create_ticket')
            .setLabel('Create a new Ticket')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(createButton);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Contact Support')
            .setDescription('Click the button below to create a new ticket.')
            .setTimestamp();

        await interaction.channel.send({ embeds: [embed], components: [row] });
    },
};
