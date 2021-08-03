const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../modals/User').User;

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
router.post('/register', (req, res) => {
    const {username, email, password, password2, check} = req.body;

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

    if (errors.length > 0) {
        res.render('register', {
            errors,
            username,
            email,
            password,
            password2,
            check
        })

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
                                    // flash message should be put here
                                    console.log(user);

                                    res.redirect('/user/login');
                                })

                                .catch(err => console.log(err));

                        })
                    })
                }
            })

            .catch(err => {if (err) {throw err} });
    }
});

router.post('/login', (req, res) => {
    const {email, password, check} = req.body;

    // here we first get user.findone and get the hashed passwor dthen using bcrypt.compare 
    // method we compare this password and the hashed password and if it matches 


    User.findOne({email:email})
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, data) => {
                    if (err){
                      // handle error
                      throw err
                    }
                    if (data) {
                        res.render('app', {user});
                    }
                      // Send JWT
                    else {
                      // response is OutgoingMessage object that server response http request
                      return res.send('password not matched')
                    }
                  });

            }
            else {
                res.render('login', {
                    email,
                    password,
                    check
                })


                
            }
            
        })
})


module.exports = router;