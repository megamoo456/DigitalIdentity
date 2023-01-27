const  sql = require("mssql");
//'mssql://User:Password@ComputerName/\Instance/DatabaseName'
const config = require('./config');

//const config = 'mssql://marin:@DESKTOP-4L0VA6U/\MSSQLSERVER/BIJOU';

//sql.connect(DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

  async function getConnection() {
    try {
      const pool = await sql.connect(config);
      if (!pool) throw new Error('Error trying to connect');
  
      return pool;
    } catch (err) {
      console.log(`⛔⛔⛔: ${err.message}`);
    }
  }
module.exports = getConnection;


