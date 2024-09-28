const pool = require('./database');

function createTables() {
    const tables = [
        {
            name: 'tickets',
            query: `CREATE TABLE IF NOT EXISTS tickets (
                ticket_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                guild_id VARCHAR(255) NOT NULL,
                channel_id VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                is_closed BOOLEAN NOT NULL DEFAULT FALSE,
                category VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );`,
        },
        {
            name: 'reports',
            query: `CREATE TABLE IF NOT EXISTS reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                platform VARCHAR(255) NOT NULL,
                reporter_id VARCHAR(255) NOT NULL,
                user VARCHAR(255) NOT NULL,
                reason TEXT NOT NULL,
                evidence TEXT,
                report_key VARCHAR(36) NOT NULL UNIQUE,
                claimed TINYINT(1) DEFAULT 0
            );`,
        },
        {
            name: 'tokens',
            query: `CREATE TABLE IF NOT EXISTS tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                discord_user_id VARCHAR(18) NOT NULL,
                token VARCHAR(32) NOT NULL,
                expire_at BIGINT NOT NULL
            );`,
        },
        {
            name: 'account_links',
            query: `CREATE TABLE IF NOT EXISTS fakenetwork_accounts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                discord_user_id VARCHAR(255) NOT NULL,
                minecraft_username VARCHAR(255) NOT NULL,
                \`rank\` VARCHAR(50) NOT NULL,  -- Backticks around 'rank'
                playtime VARCHAR(50) NOT NULL,
                gold INT(10) NOT NULL
            );`,
        },
        {
            name: 'user_levels',
            query: `CREATE TABLE IF NOT EXISTS user_levels (
                user_id VARCHAR(18) PRIMARY KEY,
                level INT NOT NULL DEFAULT 1,
                exp INT NOT NULL DEFAULT 0
            );`,
        }
    ];

    tables.forEach((table) => {
        pool.query(table.query, (err, result) => {
            if (err) {
                console.error(`Error creating table ${table.name}:`, err);
            } else if (result.warningCount === 0) {
                console.log(`Table ${table.name} created successfully.`);
            }
        });
    });
}

module.exports = createTables;
