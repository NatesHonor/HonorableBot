const { EmbedBuilder } = require('discord.js');
function createStaffEmbed() {
    const networkAdministrator = {
        "Network Administrator": [`<@335188615279804419>`],
    };
    const staffManager = {
        "Staff Manager": ["<@762087367422246963>"],
        "Deputy Staff Manager": ["<@824086387049103360>"],
    };
    const staff = {

        "Support Manager": ["<@762087367422246963>"],
        "Community Manager": ["<@219962448671670272>"],
        "Financial Manager": ["<@335188615279804419>"],
        "Gamemaster": ["Vacant"],
        "Moderator": ["Vacant"],
        "Builder": ["Vacant"],
        "Contractors": ["Vacant"],
    };

    const embed = new EmbedBuilder()
        .setTitle('Current Staff Members')
        .setColor(0x0099FF)
        .setTimestamp();
        for (const [role, members] of Object.entries(networkAdministrator)) {
            embed.addFields({ name: role, value: members.join('\n'), inline: false });
        }
        
        for (const [role, members] of Object.entries(staffManager)) {
        embed.addFields({ name: role, value: members.join('\n'), inline: true });
         }
         for (const [role, members] of Object.entries(staff)) {
            embed.addFields({ name: role, value: members.join('\n'), inline: false });
             }

    return embed;
}

module.exports = { createStaffEmbed };