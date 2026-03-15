const {Pool}= require('pg');
const env=require('./config/env');
console.log('Connecting to database...');

const pool = new Pool({
    connectionString: env.databaseUrl,
    ssl: {
        rejectUnauthorized: false
    },
    family: 4, // Use IPv4
});

module.exports = pool;