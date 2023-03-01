const express = require('express');
const passport = require('passport');
const session = require('express-session');
const app = express();
app.use(session({ secret: 'cats'}));
app.use(passport.initialize());
app.use(passport.session());
require('./auth');

function isLoggedIn(req,res,next) {
    req.user? next() : res.sendStatus(401);
}

app.get('/', (req,res) => {
res.send("<a href ='/auth/google' >Aunthenticate With Google</a>");
});

app.get('/auth/google',
passport.authenticate('google', { scope: ['email', 'profile']})
);

app.get('/google/callback',
passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure'
})
);

app.get('/auth/failure', (req,res) => {
    res.send('Something went wrong');
})

app.get('/protected', isLoggedIn, (req,res) => {
    res.send(`Hello ${req.user.displayName}`);
    console.log(req.user);
});

app.get('/logout', (req,res) => {
    req.session.destroy();
    res.send('GoodBye');
})

app.listen(3000, ()=> {
    console.log("Server started");
})