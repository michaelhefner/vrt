const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.db_username,
    database: process.env.db_name,
    password: process.env.db_pw,
    port: process.env.db_port,
    host: process.env.db_host
});
module.exports = { pool };