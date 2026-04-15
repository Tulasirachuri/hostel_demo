const mysql = require('mysql2/promise');
const dbConfig = { host: 'localhost', user: 'root', password: '', database: 'hostel' };

async function check() {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute('DESCRIBE students');
        const fs = require('fs');
        fs.writeFileSync('db_check_result.json', JSON.stringify(rows, null, 2));
        console.log('Result written to db_check_result.json');
        await conn.end();
    } catch (err) {
        console.error(err);
    }
}
check();
