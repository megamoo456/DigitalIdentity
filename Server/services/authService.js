const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/config');
const config = require('../config/config');
const getConnection = require('../config/sql');
const  sql = require("mssql");
const { SALT } = require('../config/config')

async function registerUser(userData) {
  let { name, email, password, createdAt } = userData;
  let errors = [];

  const pool = await getConnection();
  let checkUser = await pool.request().query(`SELECT * FROM [user] WHERE email = '${email}'`);
  if (checkUser && checkUser.recordset.length > 0) errors.push('This email address is already in use; ');
  if (name.length < 3 || name.length > 50) errors.push('Name should be at least 3 characters long and max 50 characters long; ')
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) == false) errors.push("Please fill a valid email address; " );
  if (password.length < 8) errors.push("Password should be at least 8 characters long; " );
  if (password.length > 20) errors.push("Password should be at max 20 characters long; " );
  if (errors.length >= 1) throw {message: [errors]}
 // Hash the password before save it.
 password = await bcrypt.hash(password, SALT);

  let result = await pool.request()
    .input('name', sql.VarChar, name)
    .input('email', sql.VarChar, email)
    .input('password', sql.VarChar, password)
    .query('INSERT INTO [user] (name, email, password) VALUES (@name, @email, @password)');
  return result;
}


async function loginUser({ email, password }) {
  const pool = await sql.connect(config);
  let user = await pool.request().query(`SELECT * FROM [user] WHERE email = '${email}'`);
  user = user.recordset[0];
  if (!user) throw { message: 'Invalid email' };

  let hasValidPass = await bcrypt.compare(password, user.password);
  if (!hasValidPass) throw { message: "Invalid password" }

  let payload = {
      id: user.id,
      email: user.email,
  }
  let token = jwt.sign(payload, SECRET);
  return token;
}

async function getUser(id) {
  const pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM users WHERE id = @id');
  return result.recordset[0];
}

module.exports = {
    registerUser,
    loginUser,
    getUser
}