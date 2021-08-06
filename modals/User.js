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
    },
    bidders: {
        type:'array',
        required: true
    },
    tags: {
        type:'array',
        required:true
    },
    image: {
        type: 'buffer',
        required: true
    },
    imagetype: {
        type: 'string',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})


bidSchema.virtual('imagePath').get(() => {
    if (this.image != null && this.imagetype != null) {
        return `data:${this.imagetype};charset=utf-8;base64,${this.image.toString('base64')}`
    }
})


const User = mongoose.model('User', userSchema);
const Bid = mongoose.model('Bid', bidSchema);

module.exports = {User, Bid};


