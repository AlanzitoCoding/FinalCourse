const mysql2 = require('mysql2');

const conn = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cimatec',
    database :'xNodeDB'
});

conn.connect(function(err){
    if(err){
        console.log("Connection Error: " + err.stack);
        return;
    }

    console.log("Connected to the DB");
});

module.exports = conn;