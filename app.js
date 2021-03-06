const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require('./api/routes/user');

// Use Mongoose to Connect to the DB
mongoose.connect('mongodb+srv://administrator:' + process.env.MONGO_ATLAS_PWD + '@nodejsshopapi-qnoti.mongodb.net/test?retryWrites=true', {
    useMongoClient: true,
    useNewUrlParser: true
    }
);
mongoose.Promise = global.Promise;

// Use Morgan as Midleware
app.use(morgan('dev'));

// Upload
app.use('/uploads', express.static('uploads'));

// Use Body-Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Adding Response Header to Avoid/Preventing CORS Issued
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
        if(req.method === 'OPTIONS'){
            res.header('Access-Control-Allow-Method', 'GET, POST, PUT, PATCH, DELETE');
            return res.status(200).json({});
        }
    next();
});

// this code is use to execute /products
app.use('/products', producRoutes);

// this code is use to execute /orders
app.use('/orders', orderRoutes);

// this code is use to execute /users
app.use("/user", userRoutes);

// Handle Error for Not Found (404) Request
app.use((req, res, next) => {
    const error = new Error('Sorry!, Not Found!');
    error.status = 404;
    next(error);
});

// Handling Other Error for All Request
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});



module.exports = app;