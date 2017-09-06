const express = require('express');
const session = require('express-session');
const passport = require('passport');
const strategy = require('./strategy');

const app = express();

app.use(session({secret: 'gimmeCode', resave: false, saveUninitialized: false}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

passport.serializeUser(function (user, done) {
    done(null, {
        id: user.id,
        displayName: user.displayName,
        nickname: user.nickname,
        email: user.emails[0].value
    });
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

app.get('/login', passport.authenticate('auth0', {
    successRedirect: '/me',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/me', (request, response) => {
    if(request.user){
        response.status(200).send(JSON.stringify(request.user, null, 10));
    } else {
        response.redirect('/login');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});