const { SlashCommandBuilder } = require('discord.js');
const mysql = require('mysql2');
const crypto = require('crypto');
const config = require('../../config.json');
const { setTimeout } = require('timers');

const connection = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
  }
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Links your Minecraft Account to your Discord!'),
  async execute(interaction) {
    const discordUserId = interaction.user.id;
    
    const checkSql = 'SELECT * FROM tokens WHERE discord_user_id = ?';
    connection.query(checkSql, [discordUserId], (checkErr, checkResult) => {
      if (checkErr) {
        console.error('Error checking linked account in MySQL:', checkErr);
        return interaction.reply('An error occurred while checking your linked account. Please try again later.');
      }

      if (checkResult.length > 0) {
        const remainingTimeInSeconds = Math.max(0, Math.ceil((checkResult[0].expire_at - Date.now()) / 1000));
        const remainingMinutes = Math.floor(remainingTimeInSeconds / 60);
        const remainingSeconds = remainingTimeInSeconds % 60;
        if (remainingMinutes === 0 && remainingSeconds === 0) {
          deleteToken(discordUserId);
        }
        const remainingTimeMessage = remainingMinutes > 0 ? `${remainingMinutes} minutes` : '';
        const remainingSecondsMessage = remainingSeconds > 0 ? `${remainingSeconds} seconds` : '';
        return interaction.reply({ content: `You have already generated a token. Please wait ${remainingTimeMessage} ${remainingSecondsMessage} before generating a new one.`, ephemeral: true });
      }

      const token = generateToken();
      const sql = 'INSERT INTO tokens (discord_user_id, token, expire_at) VALUES (?, ?, ?)';
      const expireTime = Date.now() + 5 * 60 * 1000;

      if (connection.state === 'disconnected') {
        connection.connect(err => {
          if (err) {
            console.error('Error connecting to MySQL database:', err);
            return interaction.reply('An error occurred while generating the link. Please try again later.');
          }
          executeQuery(connection, sql, [discordUserId, token, expireTime], interaction);
        });
      } else {
        executeQuery(connection, sql, [discordUserId, token, expireTime], interaction);
      }
    });
  },
};


function generateToken() {
  const tokenLength = 16;
  const buffer = crypto.randomBytes(tokenLength);
  const token = buffer.toString('hex');
  return token;
}

function executeQuery(connection, sql, values, interaction) {
  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error storing token in MySQL:', err);
      return interaction.reply('An error occurred while generating the link. Please try again later.');
    }
    console.log('Token stored in MySQL');

    const linkCommand = `/link ${values[1]}`;
    interaction.reply({content: `To link your Minecraft account to your Discord profile, please run the following command in Minecraft:\n\`${linkCommand}\`\n And then type /sync!`, ephemeral: true});

    setTimeout(() => {
      deleteToken(values[0]);
    }, 5 * 60 * 1000);
  });
}

function deleteToken(userId) {
  const deleteSql = 'DELETE FROM tokens WHERE discord_user_id = ?';
  connection.query(deleteSql, [userId], (deleteErr, deleteResult) => {
    if (deleteErr) {
      console.error('Error deleting token from MySQL:', deleteErr);
    } else {
      console.log('Token deleted from MySQL');
    }
  });
}
