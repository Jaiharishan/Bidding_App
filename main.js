const express = require('express');
const app = express();



const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {cors: {origin: "*"}})


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


const store = new mongoDBSession({
    uri: dbKey,
    collection: 'allsessions',
})


// Express session
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
const { Bid } = require('./modals/User');



// using the imported routes
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/app', appRouter);
app.use('/app/dashboard', dashboardRouter);


// websocket functionality
io.on('connection', (socket) => {
    console.log('user at:' , socket.id);
    
    socket.on('new-user', () => {

        Bid.find({})
        .then(bids => {
            bids.forEach(bid => {
                socket.join('R' + bid._id);
            })
        })
        .catch(err => console.log(err));
        
    })
    socket.on('comment', (room, data, user) => {
        console.log(room, data);
        // we need to store the comments in the database
        let id = room.slice(1,)
        Bid.findOneAndUpdate({_id:id}, {
            $push: {
                comments: {username: user, comment: data}
            }
        }).then(bid => {
            console.log(bid.bidname);
        }).catch(err => console.log(err));

        socket.broadcast.emit('comment', room, data, user);
    })
    
})


// setting and listening to ports
const PORT = process.env.PORT || 3001;
server.listen(PORT, ()=> console.log(`port is on ${PORT}`));

