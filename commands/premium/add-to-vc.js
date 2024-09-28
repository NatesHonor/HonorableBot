const { PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    data: {
        name: 'add-to-vc',
        description: 'Gives a user access to your voice channel.',
        options: [{
            type: 6,
            name: 'user',
            description: 'The user to add to your VC',
            required: true,
        }],
    },
    async execute(interaction) {
        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }

        const guild = interaction.guild;
        const member = interaction.member;
        const targetUser = interaction.options.getUser('user', true);
        const vcName = `${member.user.username}'s VC`;
        const voiceChannel = guild.channels.cache.find(channel => channel.name === vcName && channel.type === ChannelType.GuildVoice);

        if (!voiceChannel) {
            await interaction.reply({ content: 'You do not have a voice channel.', ephemeral: true });
            return;
        }
        try {
            await voiceChannel.permissionOverwrites.edit(targetUser.id, {
                Connect: true,
            });

            await interaction.reply({ content: `${targetUser.username} has been given access to ${vcName}.`, ephemeral: true });
        } catch (error) {
            console.error('Failed to add user to VC:', error);
            await interaction.reply({ content: 'There was an error adding the user to your voice channel.', ephemeral: true });
        }
    },
};
