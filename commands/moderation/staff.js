const { SlashCommandBuilder } = require('discord.js');
const { createStaffEmbed } = require('../../functions/StaffEmbed');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('staff')
    .setDescription('Displays a list of all current staff members'),

  async execute(interaction) {
    if (interaction.user.id !== '335188615279804419') {
      await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      return;
    }
    const embed = createStaffEmbed();
    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: 'Listed current staff members.', ephemeral: true });
  }
};
