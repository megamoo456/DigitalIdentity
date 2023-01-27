const { Router } = require('express');
const router = Router();
const auth = require('../middlewares/auth')();
const isAuth = require('../middlewares/isAuth')();
const User = require('../models/User');
const moment = require('moment');
const getConnection = require('../config/sql');
const  sql = require("mssql");

const clientService = require('../services/clientService');

router.get("/",isAuth,async (req, res) => {
    try {
      let clients =  await clientService.getAll();
    
      res.status(200).json(clients);
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



router.post('/create',isAuth, async (req, res) => {
    let { CT_Num, CT_Intitule, CT_Classement, CT_Contact, CT_Adresse,CT_CodePostal,CT_Ville,CT_Pays,CT_Telephone,cbCreation } = req.body;
    try {
        let errors = [];
        if (CT_Num.length < 3 || CT_Num.length > 50) errors.push('CT_Num should be at least 3 characters long and max 50 characters long; ');
        if (CT_Intitule.length < 3 || CT_Intitule.length > 50) errors.push('CT_Intitule should be at least 3 characters long and max 50 characters long; ');
        if (CT_Classement.length < 3 || CT_Classement.length > 50) errors.push('CT_Classement should be at least 3 characters long and max 50 characters long; ');
        if (CT_Contact.length < 3 || CT_Contact.length > 50) errors.push('CT_Contact should be at least 3 characters long and max 50 characters long; ');
        if (isNaN(Number(CT_Telephone))) errors.push('CT_Telephone should be a number; ');
        if (/^[A-Za-z]+$/.test(CT_Pays) == false) errors.push('CT_Pays should contains only english letters; ')
        if (!CT_Ville) errors.push('CT_Ville is required; ');

        if (errors.length >= 1) throw { message: [errors] };
        const pool = await getConnection();

        const result = await pool.request()
        .input('CT_Num', sql.VarChar, CT_Num)
        .input('CT_Intitule', sql.VarChar, CT_Intitule)
        .input('CT_Classement', sql.VarChar, CT_Classement)
        .input('CT_Contact', sql.VarChar, CT_Contact)
        .input('CT_Adresse', sql.VarChar, CT_Adresse)
        .input('CT_CodePostal', sql.Int, CT_CodePostal)
        .input('CT_Ville', sql.VarChar, CT_Ville)
        .input('CT_Pays', sql.VarChar, CT_Pays)
        .input('CT_Telephone', sql.Int, CT_Telephone)
        .input('cbCreation', sql.Date, new Date())
        .query('INSERT INTO F_COMPTET (CT_Num, CT_Intitule, CT_Classement, CT_Contact, CT_Adresse,CT_CodePostal,CT_Ville,CT_Pays,CT_Telephone,cbCreation,CT_Type) VALUES (@CT_Num, @CT_Intitule, @CT_Classement, @CT_Contact, @CT_Adresse,@CT_CodePostal,@CT_Ville,@CT_Pays,@CT_Telephone,@cbCreation,0)');

        res.status(201).json({ clientnum: result });
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: err.message })
    }
});

router.patch('/edit/:id',isAuth, async (req, res) => {
    //TODO: Rewrite this 
    let {  CT_Intitule, CT_Classement, CT_Contact, CT_Adresse,CT_CodePostal,CT_Ville,CT_Pays,CT_Telephone } = req.body;
    try {

        let errors = [];
        if (CT_Intitule.length < 3 || CT_Intitule.length > 50) errors.push('CT_Intitule should be at least 3 characters long and max 50 characters long; ');
        if (CT_Classement.length < 3 || CT_Classement.length > 50) errors.push('CT_Classement should be at least 3 characters long and max 50 characters long; ');
        if (CT_Contact.length < 3 || CT_Contact.length > 50) errors.push('CT_Contact should be at least 3 characters long and max 50 characters long; ');
        if (isNaN(Number(CT_Telephone))) errors.push('CT_Telephone should be a number; ');
        if (/^[A-Za-z]+$/.test(CT_Pays) == false) errors.push('CT_Pays should contains only english letters; ')
        if (!CT_Ville) errors.push('CT_Ville is required; ');
        

        if (errors.length >= 1) throw { message: [errors] };

        await clientService.edit(req.params.id, { CT_Intitule, CT_Classement, CT_Contact, CT_Adresse,CT_CodePostal,CT_Ville,CT_Pays,CT_Telephone  });
        res.status(201).json({ message: 'Updated!' });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
})
router.delete('/delete/:id',isAuth, async (req, res) => {
    let { id } = req.body;
    try {
    const pool = await getConnection();
    await pool.request()
    .input('CT_Num', sql.VarChar, req.params.id)
    .query(`DELETE FROM [F_COMPTET] WHERE CT_Num = @CT_Num`);
    
        res.status(201).json({ message: 'Deleted!' });
    } catch (error) {
        console.log(error)
        res.status(404).json({ error: error.message })
    }
    });




module.exports = router;