const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

let url = "mongodb://localhost:27017/shop";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.createConnection(url, { useNewUrlParser: true })
mongoose.Promise = global.Promise;

//Middleware
app.use(morgan('dev'));
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(express.json());
app.use('/uploads', express.static('uploads'))

//CORS middleware
app.use((req, res, next) => {
	res.header("Acces-Control-Allow-Origin", "*");
	res.header("Acces-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === 'OPTIONS') {
		res.header('Acces-Control-Allow-Methods', 'POST, GET, PUT, DELETE, PATCH');
		return res.status(200).json({});
	}
	next();
});

//Routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const authRoutes = require('./api/routes/user');

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);

//Error Handling
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});


app.listen(3000,
	console.log('Server is activity')
);