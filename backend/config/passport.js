const bCrypt = require('bcrypt-nodejs');

module.exports = (passport, user) => {
	const User = user;
	const LocalStrategy = require('passport-local').Strategy;

    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
    });

	passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, (req, username, password, done) => {
            const generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            User.findOne({
                where: {
                    username: username
                }
            }).then(user => {
                if (user) {
                    return done({
                        message: 'That username is already taken'
                    }, false);
                } else {
                    const userPassword = generateHash(password);
                    const data = {
                        email: req.body.email,
                        password: userPassword,
                        username: username
                    };
                    User.create(data).then(function(newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));

    //LOCAL SIGNIN
    passport.use('local-signin', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with username
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            var User = user;
            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }
            User.findOne({
                where: {
                    username: username
                }
            }).then(function(user) {
                if (!user) {
                    return done(null, false, {
                        message: 'username does not exist'
                    });
                }
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                const userinfo = user.get();
                // console.log('got user info - ', userinfo);
                return done(null, userinfo);
            }).catch(function(err) {
                console.log("Error:", err);
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
            });
        }
    ));
}