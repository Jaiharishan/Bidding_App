const express = require('express');
const app = express();

const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');

const path = require('path');
const multer = require('multer');
const gridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');


// importing the database key
const dbKey = require('./auth/dbkey').mongoURI;


// setting up the database
mongoose.connect(dbKey, {useNewUrlParser:true, useUnifiedTopology:true})
    .then(()=> console.log('dbconnected'))
    .catch(err => console.log(err));

// let gfs;
//  conn.once('open', () => {
//      gfs = Grid(conn.db)
//  })


// setting ejs and ejs layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');


// body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(methodOverride('_method'));


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


app.use(function(req, res, next) {
    // res.locals.success_msg = req.flash('success_msg');
    // res.locals.error_msg = req.flash('error_msg');
    // res.locals.error = req.flash('error');
    res.locals.info = {};
    next();
});


// importing routes
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const appRouter = require('./routes/app');
const dashboardRouter = require('./routes/dashboard');

// using the imported routes
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/app', appRouter);
app.use('/app/dashboard', dashboardRouter);

// let dt = new Date()
// dt.toLocaleString
const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`port is on ${PORT}`));