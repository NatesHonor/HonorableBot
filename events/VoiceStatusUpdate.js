const { PermissionsBitField, ChannelType } = require('discord.js');
const emptyVCTimeouts = new Map();

module.exports = (client) => {
    console.log('VoiceStatusUpdate File loaded');

    client.on('voiceStateUpdate', async (oldState, newState) => {
        if (oldState.channelId && !newState.channelId) {
            const oldChannel = oldState.guild.channels.cache.get(oldState.channelId);
            if (oldChannel && oldChannel.name.endsWith("'s VC")) {
                handlePossibleEmptyChannel(oldChannel, client);
            }
        }

        if (newState.channelId && !oldState.channelId) {
            const newChannel = newState.guild.channels.cache.get(newState.channelId);
            if (newChannel && newChannel.name.endsWith("'s VC")) {
                handleChannelOccupied(newChannel, client);
            }
        }
    });

    async function handlePossibleEmptyChannel(channel, client) {
        if (!channel || channel.members.size > 0) return;

        const timeout = setTimeout(async () => {
            if (channel.members.size === 0) {
                try {
                    await channel.delete('Voice channel was empty for too long.');
                    emptyVCTimeouts.delete(channel.id);
                    const username = channel.name.replace("'s VC", "");
                    const member = channel.guild.members.cache.find(m => m.user.username === username);
                    if (member) {
                        const userId = member.id;
                        const user = await client.users.fetch(userId);
                        user.send(`Your voice channel "${channel.name}" was deleted due to inactivity.`).catch(console.error);
                    }
                } catch (error) {
                    console.error('Failed to delete voice channel:', error);
                }
            }
        }, 3000);

        emptyVCTimeouts.set(channel.id, { timeout });
    }

    function handleChannelOccupied(channel, client) {
        if (!channel) return;

        const channelData = emptyVCTimeouts.get(channel.id);
        if (channelData && channel.name.endsWith("'s VC")) {
            clearTimeout(channelData.timeout);
            emptyVCTimeouts.delete(channel.id);
        }
    }

}
