const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');
const { check } = require('express-validator');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/registration', [
	check('name', "Name is required").notEmpty(),
	check('email', "Email is required").notEmpty(),
	check('password', "Password is required,  min 4 max 8 symbols").isLength({ min: 4, max: 8 }),
], controller.registration);

router.post('/login', controller.login);

router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers);

module.exports = router