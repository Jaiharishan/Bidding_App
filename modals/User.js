const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    username: {
        type:'string',
        required: true
    },
    email: {
        type:'string',
        required: true
    },
    password: {
        type:'string',
        required: true
    },
    date: {
        type:Date,
        default: Date.now
    }
})


const bidSchema = new mongoose.Schema({
    bidname: {
        type: 'string',
        required: true
    },
    bidprice: {
        type: 'string',
        required: true
    },
    duration: {
        type: 'string',
        required: true
    },
    owner: {
        type: 'string',
        required: true
    }
})


const User = mongoose.model('User', userSchema);
const Bid = mongoose.model('Bid', bidSchema);

module.exports = {User, Bid};