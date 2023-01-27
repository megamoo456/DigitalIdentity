const sql = require('mssql');
const jwt = require('jsonwebtoken');
const getConnection = require('../config/sql');
const config = require('../config/config');

module.exports = function () {

  return async (req, res, next) => {
    
    // Decode the token using a secret key-phrase
    try {
      const token = req.headers.authorization;

      const decoded = jwt.verify(token, config.SECRET);

   
      // create a connection to the SQL Server
      const pool = await getConnection();

      // check if user exists
      const result = await pool.request()
        .input('id', sql.Int, decoded.id)
        .query('SELECT * FROM [User] WHERE id = @id');
        
      if (result.recordset.length === 0) {
        return res.status(401).end();
      }
      return next();
    } catch (err) {
      console.log(err);

      return res.status(401).end();
    }
  };
};