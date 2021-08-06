const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../modals/User').User;
const Bid = require('../modals/User').Bid;


// to use static files
router.use(express.static('public'));

// GET requests
router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})


// POST requests

// POST request for register
router.post('/register', (req, res) => {
    const {username, email, password, password2, check} = req.body;

    // checking if any errors are there then push it to errors array
    let errors = [];
    

    if (!username || !email || !password || !password2 || !check) {
        errors.push({msg:'please fill the form'});
    }

    if (password != password2) {
        errors.push({msg:'password does not match'});
    }

    if (password.length < 8) {
        errors.push({msg:'password is too short'});
    }


    // if we find any error we render the page again
    if (errors.length > 0) {
        res.render('register', {
            errors,
            username,
            email,
            password,
            password2,
            check
        })


    // else we check if user with the same email exist then we re render the page 
    }else {
        User.findOne({email: email})
            .then(user => {
                if (user) {

                    errors.push({msg:'user already exists'});

                    res.render('register', {
                        errors,
                        username,
                        email,
                        password,
                        password2,
                        check
                    })

                }

                // if no such user exist then we encrypt the pass and save the user to the database
                else {

                    // checking if user with same username exists
                    User.findOne({username: username})
                        .then(user => {
                            if (user) {
                                errors.push({msg:'user with same username exists'});

                                res.render('register', {
                                    errors,
                                    username,
                                    email,
                                    password,
                                    password2,
                                    check
                                })
                            }
                            else {
                                const newUser = new User({
                                    username,
                                    email,
                                    password
                                })
            
                                bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(newUser.password, salt, (err, hash) => {
            
                                        if (err) throw err;
            
                                        newUser.password = hash;
            
                                        newUser.save()
                                            .then(user => {
                                                req.flash('success_msg', 'You are now registered and can log in');
                                                res.redirect('/user/login');
                                            })
            
                                            .catch(err => console.log(err));
            
                                    })
                                })
                            }
                        })
                        .catch(err => console.log(err));
                }
            })

            .catch(err => {if (err) {throw err} });
    }
});


// POST request for login
router.post('/login', (req, res) => {

    // getting login details from the form
    const {email, password, check} = req.body;

    // here we first use user.findone and get the hashed password then using bcrypt.compare 
    // method we compare this password and the hashed password and if it matches 
    // we authorize login

    // to store errors
    let errors = [];

    User.findOne({email:email})
        .then(user => {

            // if the user already registered
            if (user) {
                bcrypt.compare(password, user.password, (err, data) => {
                    if (err){
                      // handle error
                      throw err
                    }

                    // if passwords match
                    if (data) {

                        Bid.find({}, (error, bids) => {
                            if (error) {
                                res.send('something went wrong');
                            }

                            info = {
                                user,
                                bids
                            }
                            
                            res.redirect('/app');

                        })

                    }
                    // passwords does not match
                    else {

                        errors.push({msg:'password does not match'})
                        res.render('login', {
                            errors,
                            email,
                            password,
                            check
                        })
                    }
                  });

            }

            // the user not registered
            else {
                errors.push({msg:'user not registered'})
                res.render('login', {
                    errors,
                    email,
                    password,
                    check
                })
            }
            
        })
})


module.exports = router;


