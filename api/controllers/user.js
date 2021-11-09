const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('../../config')

const generateAccesToken = (id, roles) => {
	const payload = {
		id,
		roles
	}
	return jwt.sign(payload, secret, { expiresIn: "24h" });
}
class userController {

	//REGISTRATION

	async registration(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(400).json({
					message: "Registration failed", errors
				})
			}
			const { name, email, password } = req.body
			const candidate = await User.findOne({ email });
			if (candidate) {
				return res.status(400).json({
					message: "This user already exists"
				})
			}
			const hashPassword = bcrypt.hashSync(password, 10);
			const userRole = await Role.findOne({ value: "USER" });
			const user = new User({
				name: name,
				email: email,
				password: hashPassword,
				role: [userRole.value]
			});
			await user.save()
			return res.json({
				message: "Registered"
			})
		}
		catch (err) {
			console.log(err);
			res.status(200).json({
				message: "OOPS, registration error!"
			})
		}
	}

	//LOGIN

	async login(req, res, next) {
		try {
			const { name, email, password } = req.body
			const user = await User.findOne({ email });
			if (!user) {
				res.status(400).json({
					message: `${name} not found`
				});
			}
			const validPassword = bcrypt.compareSync(password, user.password)
			if (!validPassword) {
				res.status(400).json({
					message: `Password incorrect`
				})
			}
			const token = generateAccesToken(user._id, user.roles)
			return res.json({ token });
		}
		catch (err) {
			console.log(err);
			res.status(200).json({
				message: "OOPS, login error!"
			})
		}
	}

	//GET USERS

	async getUsers(req, res, next) {
		try {
			const users = await User.find();
			res.status(200).json({ users });
		}
		catch (error) {
			console.log(error);
			res.status(500).json({
				error: error
			})
		}
	}
}

module.exports = new userController