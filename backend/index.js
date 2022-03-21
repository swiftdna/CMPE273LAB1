const express = require('express');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session')
const app = express();
const routes = require('./routes');
require('dotenv').config();
const port = process.env.NODE_LOCAL_PORT || 4000;

//For BodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cors());

// For Passport
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use('/api', routes);
const models = require("./models");
//load passport strategies
require('./config/passport.js')(passport, models.user);
COREAPP = {
  models
};
//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});

app.post('/signin', (req, res, next) => {
  passport.authenticate('local-signin', (err, user, info) => {
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
        res.json({ info, success: true, isAuthenticated: true, user: {email: user.email, id: user.id, username: user.username} });
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
    res.json({ success: true, isAuthenticated: true, user: {email: user.email, id: user.id, username: user.username} });
    next();
  })(req, res, next);
});

app.post('/logout', (req, res) => {
  req.logOut();
  req.session.destroy(()=>{
    // destroy session data
    req.session = null;
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