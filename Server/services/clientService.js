const User = require('../models/User');
const getConnection = require('../config/sql');
const  sql = require("mssql");

async function getAll() {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .query(`SELECT * FROM F_COMPTET WHERE CT_Type = 0`);
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}


async function findById(id) {
      // create a connection to the SQL Server
      const pool = await getConnection();

      // query to find the client by id
      const result = await pool.request()
          .input('id', sql.Int, id)
          .query('SELECT * FROM [Client] WHERE CT_Num = @id');
  
      // return the client record
      return result.recordset[0];
  }
  
async function edit(id, data) {
    const pool = await getConnection();

        // update the product
        const result = await pool.request()
        .input('CT_Num', sql.VarChar, id)
        .input('CT_Intitule', sql.VarChar, data.CT_Intitule)
        .input('CT_Classement', sql.VarChar, data.CT_Classement)
        .input('CT_Contact', sql.VarChar, data.CT_Contact)
        .input('CT_Adresse', sql.VarChar, data.CT_Adresse)
        .input('CT_CodePostal', sql.Int, data.CT_CodePostal)
        .input('CT_Ville', sql.VarChar, data.CT_Ville)
        .input('CT_Pays', sql.VarChar, data.CT_Pays)
        .input('CT_Telephone', sql.Int, data.CT_Telephone)
        .query(`UPDATE [F_COMPTET] SET CT_Intitule = @CT_Intitule, CT_Classement = @CT_Classement, CT_Contact = @CT_Contact, CT_Adresse = @CT_Adresse, CT_CodePostal = @CT_CodePostal, CT_Ville = @CT_Ville, CT_Pays = @CT_Pays, CT_Telephone = @CT_Telephone WHERE CT_Num = @CT_Num`);
       // .input('CT_Num', sql.Int, id)
       // .query(`UPDATE [F_COMPTET] SET ${Object.keys(data).map(key => key + " = @" + key).join(', ')} WHERE CT_Num = @CT_Num`);

    return result;
   
}




module.exports = {
    getAll,
    findById,
    edit
}
