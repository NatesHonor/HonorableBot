const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { createPositionEmbed } = require('../../functions/PositionEmbed');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('positions')
    .setDescription('Displays a list of all current staff members'),

  async execute(interaction) {
    if (interaction.user.id !== '335188615279804419') {
      await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      return;
    }
    const createButton = new ButtonBuilder()
    .setCustomId('apply_for_a_position')
    .setLabel('Apply for a position above!')
    .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(createButton);
    const embed = createPositionEmbed();
    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: 'Listed current open positions', ephemeral: true });

    
  }
};
