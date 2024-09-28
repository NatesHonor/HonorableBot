const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
    new SlashCommandBuilder()
        .setName('create_ticket')
        .setDescription('Creates a new support ticket.')
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken('YOUR_BOT_TOKEN');

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands('YOUR_APPLICATION_ID'),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
