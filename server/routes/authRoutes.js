const  express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser, loginUser, getProfile, logoutUser } = require('../controllers/authController');
const authController = require('../controllers/authController');
router.use(
    cors({
        credential: true,
        origin: 'http://localhost:5173'
    }
        
    ));

router.get('/', test);


router.post('/register', registerUser)
router.post('/login', authController.loginUser);
router.get('/profile',getProfile)
router.post('/logout', authController.logoutUser);


module.exports = router