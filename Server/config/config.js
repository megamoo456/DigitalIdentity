const TABLE_NAME = 'BIJOU';
const config = {
    PORT: process.env.PORT || 5000,
   // DB_CONNECTION: `mssql://sa:@DESKTOP-4L0VA6U/\marin/${TABLE_NAME}`,
   user: "amin",
   password:"123456789",
   database: "BIJOU",
   options: {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true},
   server: "DESKTOP-4L0VA6U",
   SECRET: 'badumts',
   COOKIE_NAME: 'USER_SESSION',
   HOST: "localhost",
   dialect: "mssql",
   SALT: 10

}

module.exports = config;