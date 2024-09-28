const { sleep } = require('./Sleep')
const { EmbedBuilder } = require('discord.js');

async function handleModeratorSelection(interaction) {
    const channel = interaction.channel;
    await channel.send("Hello! I'm here to assist you to apply for the Moderator Position 😊");
    await sleep(3000);
    await channel.send("First let me tell you some ROLE SPECIFIC requirements, responsibilites, rules that apply to just moderator! Just give me one moment...")
    await sleep(4000);
    const embed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle(`Moderation Standards`)
    .setDescription(`Be aware you could be denied or even BANNED for not adhearing by the regulations`)
    .addFields(
      { name: 'Requirements', value: 'Moderator Specific Requirements'},
      { name: '\u200B', value: '\u200B' },
      { name: 'Age Requirement', value: 'Must be atleast 15 years of age.', inline: true },
      { name: 'Microphone', value: 'Microphone required.', inline: true },
      { name: 'Familiarity', value: 'Must be familiar with the Network.', inline: true },
      { name: 'Responsibilities', value: '\u200B' },
      { name: 'Requirements', value: 'Moderator Specific Requirements'},
      { name: '\u200B', value: '\u200B' },
      { name: 'Age Requirement', value: 'Must be atleast 15 years of age.', inline: true },
      { name: 'Microphone', value: 'Microphone required.', inline: true },
      { name: 'Familiarity', value: 'Must be familiar with the Network.', inline: true },
      { name: '\u200B', value: '\u200B' },
      { name: 'Rules', value: 'Moderator Specific Rules'},
      { name: '\u200B', value: '\u200B' },
      { name: 'Abuse', value: 'Abuse of permissions and commands will not be tolerated.', inline: true },
      { name: 'Punishments', value: 'Sharing the status of a punishment will not be tolerated.', inline: true },
      { name: 'Community', value: 'Must interact with the network.', inline: true },
      { name: 'Questions', value: 'Must be capable to answer questions or redirect people to someone who can.', inline: true },
  )
    .setTimestamp();
    await channel.send({embeds: [embed]});
    await sleep(5000);
    await channel.send("Just to let you know since the age limit is 14 this is an **UNPAID** position.")
    await sleep(2000);
    await channel.send("Now onto the actual application! Please paste the following questions below and answer them then type /submit and I will send your application off!")
    await sleep(2000);
    await channel.send("Remember this is still a game so don't stress about it! And above all, Good Luck!")
    await sleep(2000);
    await channel.send("Give me up to 10 seconds to send you your application...")
    await sleep(10000);
    await channel.send(`
    \u200B
    \u200B
    **Helper Application** \u200B
    Thank you for taking the time to apply to our team! We just have 8 Simple questions to ask you and then you'll be all good! \u200B
    \u200B
    Prefered Name (Can be a username or nickname)? \u200B
    Age? \u200B
    Timezone? \u200B
    How long have you been a part of our Network? \u200B
    How much time can you dedicate to our server? \u200B
    Why do you want to be staff on our server? \u200B
    Are you applying to be a Helper for our Discord Server, Minecraft Server, or Both?\u200B
    Why should we consider you over other applicants? \u200B
    `);
  
  }

module.exports = { handleModeratorSelection };