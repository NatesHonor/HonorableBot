const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submitapplication')
        .setDescription('Submit your application'),

    async execute(interaction) {
        const channel = interaction.channel;
        const channelNameMatch = channel.name.match(/^(.+?)-application$/); 
        if (channelNameMatch) {
            let userName = channelNameMatch[1];
            if (userName.endsWith('s')) {
                userName = userName.slice(0, -1);
            }

            await channel.send(`Okay! Submitting your application, ${userName}.`);
            for (let i = 5; i >= 1; i--) {
                await channel.send(`Countdown: ${i} seconds...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            const user = await interaction.guild.members.fetch({ query: userName, limit: 1 });
            const roleId = '1216205298579144794';
            const role = interaction.guild.roles.cache.get(roleId);
            if (role) {
                await channel.send(`Attention ${role}, ${userName}'s application has been submitted!`);
            } else {
                console.error(`Role with ID ${roleId} not found.`);
            }
            if (user.size > 0) {
                const roleId = '1216205509112365206';
                const role = interaction.guild.roles.cache.get(roleId);

                if (role) {
                    const member = user.first();
                    await member.roles.add(role);
                    await channel.permissionOverwrites.create(member.id, { VIEW_CHANNEL: false });
                } 
                await interaction.channel.permissionOverwrites.edit(interaction.user.id, {
                    [PermissionsBitField.Flags.ViewChannel]: false
                  });
            }
        } else {
            await interaction.reply("This command is only applicable in application channels.");
        }
    },
};
