const { register, login, getProfile } = require('../controllers/auth-controller');
const authenticate = require('../middleware/authenticate');
const { validateRegister, validatelogin } = require('../validators');

const router = require('express').Router();

router.post('/register', validateRegister, register);

router.post('/login', validatelogin, login);

router.get('/me', authenticate, getProfile);

module.exports = router;