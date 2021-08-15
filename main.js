const express = require('express');
const app = express();

const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const mongoDBSession = require('connect-mongodb-session')(session)

// importing the database key
const dbKey = require('./auth/dbkey').mongoURI;


// setting up the database
mongoose.connect(dbKey, {useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false})
    .then(()=> console.log('dbconnected'))
    .catch(err => console.log(err));


// setting ejs and ejs layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');



// body parser
app.use(express.json());
app.use(express.urlencoded({limit: '50mb', extended: false}));


// to use static files like imgs css, js files
app.use(express.static('public'));


// to store the session in mongodb
const store = new mongoDBSession({
    uri: dbKey,
    collection: 'allsessions',
})


// Express session with expire time of 1 hour
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
        store: store,
        cookie: {
            maxAge: 1000 * 60 * 60 * 1,
        }
    })
);



// Connect flash
app.use(flash());


// flash messages or stored globally
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.warning_msg = req.flash('warning_msg');
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


// setting and listening to ports
const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`port is on ${PORT}`));