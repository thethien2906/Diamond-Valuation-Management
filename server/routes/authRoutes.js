const  express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser, loginUser, getProfile, logoutUser, verifyEmail, forgotPassword, resetPassword, verifyResetCode } = require('../controllers/authController');

router.use(
    cors({
        credential: true,
        origin: 'http://localhost:5173'
    }
        
    ));

router.get('/', test);


router.post('/register', registerUser)
router.post('/login', loginUser);
router.get('/profile',getProfile)
router.post('/logout', logoutUser);
router.post('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);
module.exports = router