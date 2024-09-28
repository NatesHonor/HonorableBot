const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    data: {
        name: 'closevc',
        description: 'Closes all voice channels with a specific naming pattern.',
    },
    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm_close_vc')
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('cancel_close_vc')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Secondary),
            );

        const message = await interaction.reply({
            content: 'Are you sure you want to close your vc?',
            components: [row],
            fetchReply: true,
        });

        const filter = i => i.user.id === interaction.user.id && (i.customId === 'confirm_close_vc' || i.customId === 'cancel_close_vc');

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'confirm_close_vc') {
                const channels = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice && channel.name.endsWith('\'s VC'));

                for (const channel of channels.values()) {
                    try {
                        await channel.delete();
                        console.log(`Deleted channel: ${channel.name}`);
                    } catch (error) {
                        console.error(`Failed to delete channel: ${channel.name}`, error);
                    }
                }

                await i.update({ content: 'Successfully closed your vc', components: [] });
            } else if (i.customId === 'cancel_close_vc') {
                await i.update({ content: 'Voice channel closure cancelled.', components: [] });
            }
        });

        collector.on('end', collected => {
            if (!collected.size) interaction.editReply({ content: 'No response, action cancelled.', components: [] });
        });
    },
};
