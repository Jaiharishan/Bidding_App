const express = require('express');
const app = express();

const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');



// importing the database key
const dbKey = require('./auth/dbkey').mongoURI;

// setting up the database
mongoose.connect(dbKey, {useNewUrlParser:true, useUnifiedTopology:true})
    .then(()=> console.log('dbconnected'))
    .catch(err => console.log(err));


// setting ejs and ejs layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');


// body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// to use static files like imgs css, js files
app.use(express.static('public'));


// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Connect flash
app.use(flash());


// importing routes
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

// using the imported routes
app.use('/', indexRouter);
app.use('/user', userRouter);


const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`port is on ${PORT}`));