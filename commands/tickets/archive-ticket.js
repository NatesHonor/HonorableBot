const pool = require('../../data/MySQL/database');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
    data: {
        name: 'archive',
        description: 'Archive and delete this ticket',
    },
    async execute(interaction, client) {
        if (!interaction.channel.name.startsWith('ticket-')) {
            await interaction.reply({ content: 'This command can only be used in ticket channels.', ephemeral: true });
            return;
        }

        const ticketId = interaction.channel.name.split('-')[1];
        const isClosed = await fetchTicketIsClosed(ticketId);
        if (!isClosed) {
            await interaction.reply({ content: 'This ticket is not closed yet.', ephemeral: true });
            return;
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm_archive')
                    .setLabel('Confirm Archive')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('cancel_archive')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Secondary),
            );

        await interaction.reply({
            content: 'Are you sure you want to archive and delete this ticket?',
            components: [row],
        });

        const filter = i => 
            i.customId === 'confirm_archive' || i.customId === 'cancel_archive';
        
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            await i.deferReply();
            if (i.customId === 'confirm_archive') {
                // Fetch additional ticket details including category, IGN, and reason
                const ticketDetails = await fetchTicketDetails(ticketId);
                if (!ticketDetails || !ticketDetails.isClosed) {
                    await i.editReply({ content: 'This ticket cannot be archived because it is not closed or does not exist.', components: [] });
                    return;
                }
        
                const user = await client.users.fetch(ticketDetails.userId).catch(console.error);
                const userName = user ? user.username : "Unknown User";
        
                const logFilePath = path.join(__dirname, `../../data/tickets/ticket-${ticketId}.txt`);
        
                // Format the message to be sent to the archive channel
                const archiveMessageContent = [
                    `**Name:** ${userName} (${ticketDetails.userId})`,
                    `**Category:** ${ticketDetails.category}`,
                    `**IGN:** ${ticketDetails.ign || "N/A"}`,
                    `**Reason:** ${ticketDetails.reason}`,
                    `**Text Log:**`
                ].join('\n');
        
                // Send the message and log file to the archive channel
                try {
                    const archiveChannel = await client.channels.fetch('1210023129481617468');
                    await archiveChannel.send({
                        content: archiveMessageContent,
                        files: [logFilePath]
                    });
                } catch (error) {
                    console.error('Failed to send ticket log to the archive channel:', error);
                }
        
                for (let countdown = 5; countdown > 0; countdown--) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await i.editReply({ content: `Archiving ticket in ${countdown} seconds...`, components: [] });
                }
                await interaction.channel.delete();
            } else if (i.customId === 'cancel_archive') {
                await i.editReply({ content: 'Ticket archive cancelled.', components: [] });
            }
        });    
        

        collector.on('end', collected => {
            if (!collected.size) {
                interaction.editReply({ content: 'Archive process expired. No action taken.', components: [] });
            }
        });
    },
};

async function fetchTicketDetails(ticketId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT user_id, category, ign, message, is_closed FROM tickets WHERE id = ?';
        pool.query(query, [ticketId], (err, results) => {
            if (err) {
                console.error('Error fetching ticket details:', err);
                reject(err);
            } else if (results.length > 0) {
                const { user_id, category, ign, message, is_closed } = results[0];
                resolve({
                    userId: user_id,
                    category,
                    ign,
                    message,
                    isClosed: is_closed === 1
                });
            } else {
                resolve(null);
            }
        });
    });
}

async function fetchTicketIsClosed(ticketId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT is_closed FROM tickets WHERE id = ?';
        pool.query(query, [ticketId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.length > 0 && results[0].is_closed === 1);
            }
        });
    });
}