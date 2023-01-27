const router = require('express').Router();
const authController = require('./controllers/authController');
const clientController = require('./controllers/clientController');
//const isAuth = require('./middlewares/isAuth');


router.get('/', (req, res) => {
    res.send('Server is running')
})
router.use('/auth', authController);
router.use('/clients', clientController);




module.exports = router;