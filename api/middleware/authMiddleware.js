const jwt = require('jsonwebtoken');
const { secret } = require('../../config');

module.exports = (req, res, next) => {
	if (req.method === "OPTIONS") {
		next()
	}
	try {
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			return res.status(403).json({ message: "User unauthorization" })
		}
		const decodedData = jwt.verify(token, process.env.JWT_KEY);
		req.user = decodedData;
		console.log(req.user)
		next()
	} catch (error) {
		console.log(error);
		return res.status(403).json({ message: "User unauthorization" });
	}
}