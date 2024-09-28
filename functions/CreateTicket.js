const { EmbedBuilder, ChannelType, ActionRowBuilder, PermissionsBitField, SelectMenuBuilder } = require('discord.js');
const pool = require('../data/MySQL/database');

async function handleCreateTicket(buttonInteraction) {
    console.log('handle create ticket button triggered');
    if (!buttonInteraction.deferred && !buttonInteraction.replied) {
        await buttonInteraction.deferReply({ ephemeral: true });
    }

    const guildId = buttonInteraction.guild.id;
    const ticketContent = 'No reason set';
    const ticketCategory = '1209636471070400534';

    const buttonClickerId = buttonInteraction.user.id;
    const insertQuery = 'INSERT INTO tickets SET ?';
    const supportCategory = 'general';
    const ticketData = {
        user_id: buttonClickerId,
        guild_id: guildId,
        message: ticketContent,
        is_closed: false,
        category: supportCategory,
    };

    pool.query(insertQuery, ticketData, async (err, result) => {
        if (err) {
            console.error('Error creating a new ticket:', err);
            await buttonInteraction.editReply({ content: 'There was an error creating a new ticket.' });
            return;
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('select_support_category')
                    .setPlaceholder('Select a support category')
                    .addOptions([
                        {
                            label: 'Missionchief Bot Support',
                            value: 'missionchief_bot_support',
                        },
                        {
                            label: 'Nate Launcher Support',
                            value: 'nate_launcher_support',
                        },
                        {
                            label: 'Minecraft Support',
                            value: 'minecraft_support',
                        },
                        {
                            label: 'Discord Support',
                            value: 'discord_support',
                        },
                    ]),
            );

        const ticketId = result.insertId;
        try {
            const ticketChannel = await buttonInteraction.guild.channels.create({
                name: `ticket-${ticketId}`,
                type: ChannelType.GuildText,
                parent: ticketCategory,
                permissionOverwrites: [
                    {
                        id: buttonInteraction.guild.roles.everyone.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: buttonClickerId,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                        deny: [PermissionsBitField.Flags.SendMessages],
                    },
                ],
            });

            const updateQuery = 'UPDATE tickets SET channel_id = ? WHERE ticket_id = ?';
            pool.query(updateQuery, [ticketChannel.id, ticketId], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating ticket with channel ID:', updateErr);
                } else {
                    console.log('Ticket updated with channel ID successfully.');
                }
            });

            const ticketURL = `https://support.fakenetwork.com/tickets/${ticketId}`;
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Ticket #${ticketId}`)
                .setDescription(`In order to send a message you need to select a support category! \n \n Please follow this link to view your ticket on our website: Ticket #${ticketId}`)
                .setTimestamp();

            await ticketChannel.send({ content: `<@${buttonClickerId}>`, embeds: [embed], components: [row] });
            await buttonInteraction.editReply({ content: 'Your ticket has been created!', components: [] });
        } catch (channelError) {
            console.error('Error creating ticket channel:', channelError);
            await buttonInteraction.editReply({ content: 'There was an error creating the ticket channel.' });
        }
    });
}

module.exports = { handleCreateTicket };
