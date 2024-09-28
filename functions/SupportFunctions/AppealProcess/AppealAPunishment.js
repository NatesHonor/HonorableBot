const fs = require('fs');
const path = require('path');
const database = require('../../../data/MySQL/database');
const { startTheAppealProcess } = require('./StartAppealProcess');
const { PermissionsBitField } = require('discord.js')

async function appealapunishment(client, banId) {
    const query = `SELECT hasappealed FROM punishments_bans WHERE banid = '${banId}'`;

    database.query(query, async (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            return;
        }

        const authorId = client.user.id;
        const hasAppealed = results[0]?.hasappealed;

        if (hasAppealed === true) {
            startTheAppealProcess(client);
        } else {
            const channel = client.channel;
            const author = await channel.send("Please type your BanID in chat. You have 30 seconds to do so.");
            await channel.permissionOverwrites.create(authorId, {
                ViewChannel: true,
                SendMessages: true,
            });
            const filter = m => m.author.id === author.author.id;
            const collector = channel.createMessageCollector(filter, { time: 30000 });

            collector.on('collect', m => {
                const typedBanId = m.content.trim();
                console.log(`Received BanID: #${typedBanId}`);
                collector.stop();
                startTheAppealProcess(client, "#" + typedBanId);
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    channel.send("Cancelled because no response has been received.");
                }
            });
        }
    });
}

module.exports = { appealapunishment };
