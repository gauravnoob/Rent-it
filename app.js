require('dotenv').config();
const port = process.env.Port || 3000;
const express = require("express");
const app = express();
const body = require('body-parser');
app.use(body.urlencoded({ extended: true }))
const path = require('path');
app.use(express.static("public"));
app.set('view engine', 'ejs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/rent', { useNewUrlParser: true, useUnifiedTopology: true });
const register = require('./models/registers');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const auth = require('./middleware/auth');


app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post("/", async function (req, res) {
  try {
    const userInformation = new register({
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
      password: req.body.password
    });
    console.log(userInformation);
    const token = await userInformation.generateAuthToken();
    console.log("the token part   " + token);
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60000),
      httpOnly: true
    });

    const registered = await userInformation.save();
    console.log(req.body.email);
    res.sendFile(path.join(__dirname + '/login.html'));
  } catch (error) {
    res.status(400).send('error');
  }
})


app.get('/login.html', function (req, res) {

  res.sendFile(path.join(__dirname + '/login.html'));
});


app.post('/login.html', async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await register.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, userEmail.password);
    const token = await userEmail.generateAuthToken();
    console.log(token);
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 120000),
      httpOnly: true
    });
    if (isMatch) {
      res.status(201).render('home.ejs');

    } else {
      res.send("Invalid password details");
    }
  } catch (error) {
    res.status(400).send("invalid login details");
  }
});

app.get('/about', (req, res) => {
  res.render('about.ejs');
})
app.get('/home', (req, res) => {
  res.render('home.ejs');
});
app.get('/addcar', (req, res) => {
  res.render('addcar.ejs');
});
app.post('/addcar',function(req,res) {
console.log(req.body.cars);
console.log(req.body.carname);
console.log(req.body.carAvailableStartTime);
console.log(req.body.carAvailableEndTime);
});
app.get('/history', (req, res) => {
  res.render('history.ejs');
});

app.get('/logout', auth, async (req, res) => {
  try {

    // req.userInformation.tokens = req.userInformation.tokens.filter((currentElement) => {
    //   return currentElement.token != req.token;
    // });
    req.userInformation.tokens = [];

    res.clearCookie("jwt");
    console.log('logout Succesful');
    console.log(auth);
    await req.userInformation.save();
    res.redirect('/login.html');
  } catch (error) {
    res.status(500).send(error);
  }
})

app.listen(port, function (req, res) {
  console.log("project is getting ready");
});