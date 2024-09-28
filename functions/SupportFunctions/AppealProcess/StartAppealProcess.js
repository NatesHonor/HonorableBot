const { sleep } = require('../../Sleep');
const { EmbedBuilder } = require('discord.js');
const database = require('../../../data/MySQL/database');

async function startTheAppealProcess(interaction, banId) {
    const query = `SELECT hasappealed, reason, name, ban_time, unban_time, exact_duration FROM punishments_bans WHERE banid = '${banId}'`;
    const channel = interaction.channel;
    
    database.query(query, async (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            return;
        }

        const [result] = results;
        const { name, reason, exact_duration: duration, ban_time: banTime, unban_time: unbanTime } = result;



        await channel.send("Hey There! Everyone makes mistakes and of course everyone deserves a second chance.");
        await sleep(6000);
        await channel.send("Since you gave me your BanID Please give me one second to look you up!");
        await sleep(4000);

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle(`⚠ ATTENTION!!!! ⚠`)
            .setDescription(`Sharing your BanID Can and **WILL** effect the processing of your appeal, please tread lightly as you can only appeal **ONCE**`)
            .setTimestamp();

        await channel.send({ embeds: [embed] });
        await sleep(5000);

        await channel.send("Okay! So far this is what i've gathered based on the information you provided!");
        await sleep(2000);

        const embed2 = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle(`Punishment Info`)
            .setDescription(`All the information on file about your punishment!`)
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Username', value: `${name}`, inline: true },
                { name: 'Reason', value: `${reason}`, inline: true },
                { name: 'Duration', value: `${duration}`, inline: true },
                { name: 'Ban Date', value: `${banTime}`, inline: true },
                { name: 'Unban Date', value: `${unbanTime}`, inline: true },
            )
            .setTimestamp();

        await channel.send({ embeds: [embed2] });
        await sleep(5000);

        await channel.send("If this is correct please type `yes` below, otherwise type no, you have 10 seconds.");

        const filter = m => m.author.id === interaction.user.id;
        const collector = channel.createMessageCollector(filter, { time: 10000, max: 1 });

        collector.on('collect', m => {
            const isAppealDataCorrect = m.content.trim();
            if (isAppealDataCorrect.toLowerCase() === "yes") {
                channel.send("Thanks for confirming! Now that we have confirmed that the ban info is correct please follow these next steps!");
                sendAppealMessage(interaction)
            } else if (isAppealDataCorrect.toLowerCase() === "no") {
                channel.send("No detected, cancelling appeal process");
                channel.send("If this was done in error or you are having technical issues feel free to contact a staff member or trying again!");
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                channel.send("Cancelled because no response has been received.");
            }
        });


    });

   
}

async function sendAppealMessage(interaction) {
    const channel = interaction.channel;
    await sleep(2000);
    const embed3 = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle(`Appeal Process`)
        .setDescription(`Brief explanation of the appeal process, it's as simple as 1, 2, 3!`)
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Step 1:', value: `Copy and paste the appeal format below and answer it`, inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Step 2:', value: `Submit the appeal`, inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Step 3:', value: `Wait for a response from the bot or staff member on the status of your appeal!`, inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'NOTE', value: `For faster replies it's better to appeal on our website`, inline: true },
        );
    await channel.send({ embeds: [embed3] });

    await sleep(5000);
    channel.send("Now it's time for your appeal! Just copy the following below and just paste it back answering it.");
    channel.send("When finished just do /close like you would any other ticket!");
    await sleep(3000);
    await channel.send(`
    \u200B
    \u200B
    **(YourName)'s Appeal!** \u200B
    Please note that sharing the status of your appeal to a staff member can result in an instant denial \u200B
    \u200B
    Username? \u200B
    Why were you banned? \u200B
    Was this ban false? If so then on what bases? \u200B
    Why should you be unbanned? \u200B
    If unbanned Will you do it again?  \u200B
    Anything else we should know? \u200B
    `);
}

module.exports = { startTheAppealProcess };
