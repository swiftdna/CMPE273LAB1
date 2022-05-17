const express = require('express');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const routes = require('./routes');
require('dotenv').config();
const port = process.env.NODE_LOCAL_PORT || 4000;
const connect = require('./config/connect');
// const graphql = require('./graphql');
const graphqlController = require('./graphql/controller');
const jwtSecret = require('./config/jwtConfig');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

//For BodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(cors());

// For Passport
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions

// bootstrap graphql
// graphql();
app.use('/graphql', graphqlController);

app.use('/api', routes);
COREAPP = {};
connect().then(() => {
  console.log('passport bootstrap!');
  require('./config/passport.js')(passport);
});
// const models = require("./models");
//load passport strategies
//Sync Database

app.post('/signin', (req, res, next) => {
  passport.authenticate('local-signin', {session: false}, (err, user, info) => {
    if (err) {
      console.log('err -> ', err);
      res.json({success: false, message: err});
      next();
      return;
    }
    if (!user) {
      res.json({ success: false, isAuthenticated: false, ...info });
    } else {
      req.login(user, error => {
        if (error) return next(error);
        const userObj = {email: user.email, id: user._id, username: user.username};
        const token = jwt.sign(userObj, jwtSecret.secret);
        res.cookie('etsy_token', token, { httpOnly: true });
        res.json({ info, success: true, isAuthenticated: true, user: userObj, token });
        return;
      });
    }
    next();
  })(req, res, next);
});

app.post('/signup', (req, res, next) => {
  passport.authenticate('local-signup', (err, user, info) => {
    if (err) {
      console.log('err -> ', err);
      res.json({success: false, message: err});
      next();
      return;
    }
    res.json({ success: true, isAuthenticated: true, user: {email: user.email, id: user._id, username: user.username} });
    next();
  })(req, res, next);
});

app.post('/logout', (req, res) => {
  // req.logOut();
  req.session.destroy(()=>{
    // destroy session data
    req.session = null;
    res.clearCookie("etsy_token");
    res.json({success: true});
  });
});

app.get('*', function (req, res) {
  res.sendFile(`${__dirname}/public/index.html`, (err) => {
    if (err) {
      console.log(err);
      res.end(err.message);
    }
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});

module.exports = app;