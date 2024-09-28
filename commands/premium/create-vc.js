const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    data: {
        name: 'createvc',
        description: 'Creates a private voice channel for the user.',
    },
    async execute(interaction) {
        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }

        const requiredRoleId = '1210166421363892244';
        const requiredRoleId2 = '1057800828049694730';
        if (!interaction.member.roles.cache.has(requiredRoleId || requiredRoleId2)) {
            await interaction.reply({ content: 'To use this command purchase a rank!', ephemeral: true });
            return;
        }

        const guild = interaction.guild;
        const member = interaction.member;
        const vcName = `${member.user.username}'s VC`;

        const existingChannel = guild.channels.cache.find(channel => channel.name === vcName && channel.type === ChannelType.GuildVoice);
        if (existingChannel) {
            await interaction.reply({ content: 'You already have a voice channel created.', ephemeral: true });
            return;
        }

        const permissions = [
            {
                id: member.id,
                allow: [
                    PermissionsBitField.Flags.ManageChannels,
                    PermissionsBitField.Flags.MoveMembers,
                    PermissionsBitField.Flags.MuteMembers,
                    PermissionsBitField.Flags.DeafenMembers,
                    PermissionsBitField.Flags.Speak,
                ],
            },
            {
                id: guild.roles.everyone.id,
                deny: [PermissionsBitField.Flags.Connect],
            },
        ];

        const categoryId = '1209622386681581590';
        try {
            await guild.channels.create({
                name: vcName,
                type: ChannelType.GuildVoice,
                parent: categoryId,
                permissionOverwrites: permissions,
                userLimit: 3,
            });

            await interaction.reply({ content: `Voice channel "${vcName}" created within the specified category.`, ephemeral: true });
        } catch (error) {
            console.error('Failed to create voice channel:', error);
            await interaction.reply({ content: 'There was an error creating the voice channel.', ephemeral: true });
        }
    },
};
