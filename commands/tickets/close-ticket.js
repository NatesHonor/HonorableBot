const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const pool = require('../../data/MySQL/database');

module.exports = {
  data: {
    name: 'close',
    description: 'Close your current ticket',
  },
  async execute(interaction) {
    const channelId = interaction.channel.id;
    try {
        const ticketData = await fetchTicketData(channelId);
        if (!ticketData) {
          await interaction.reply({ content: 'This isn\'t a Ticket.', ephemeral: true });
          return;
        }
        if (interaction.user.id !== ticketData.user_id) {
          await interaction.reply({ content: 'You are not the creator of this ticket.', ephemeral: true });
          return;
        }
    
      } catch (error) {
        console.error('Error fetching ticket data:', error);
        await interaction.reply({ content: 'There was an error processing your request.', ephemeral: true });
      }

    const confirmButton = new ButtonBuilder()
      .setCustomId('confirm_close')
      .setLabel('Confirm Close')
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId('cancel_close')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

    const confirmationMessage = await interaction.reply({
      content: 'Are you sure you want to close this ticket?',
      components: [row],
      fetchReply: true,
    });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = confirmationMessage.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async (i) => {
        if (i.customId === 'confirm_close') {
            const ticketData = await fetchTicketData(channelId);
            if (!ticketData) {
              console.error('Failed to fetch ticket data.');
              await i.reply({ content: 'Failed to fetch ticket data.', ephemeral: true });
              return;
          }
          await interaction.channel.permissionOverwrites.edit(interaction.user.id, {
            [PermissionsBitField.Flags.ViewChannel]: false
          });
                try {
          await interaction.user.send(`Your ticket has been closed: https://support.natemarcellus.com/tickets/${ticketId}`);
          closeTicket(channelId);
        } catch (error) {
          console.log("Couldn't send DM to user, possibly due to DMs being disabled.");
        }
        await i.update({ content: 'Ticket has been closed.', components: [] });
      } else if (i.customId === 'cancel_close') {
        interaction.editReply({ content: 'Okay! Ticket Cancellation process aborted..', components: [] });
      }
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        interaction.editReply({ content: 'No response, ticket close process aborted.', components: [] });
      }
    });
  },
};

function fetchTicketData(channelId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT user_id, channel_id FROM tickets WHERE channel_id = ?';
    pool.query(query, [channelId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null);
        }
      }
    });
  });
} 

function closeTicket(channelId) {
  return new Promise((resolve, reject) => {
  const updateQuery = 'UPDATE tickets SET is_closed = 1 WHERE ticket_id = ?';
  pool.query(updateQuery, [channelId], (err) => {
    if (err) {
    console.error('Error closing the ticket:', err);
    reject(err);
    } else {
    resolve(true);
      }
    });
  });
}
