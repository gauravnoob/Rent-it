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


app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
// app.post("/", async function (req, res) {
//   const userInformation = new register({
//     name: req.body.name,
//     email: req.body.email,
//     number: req.body.number,
//     password: req.body.password
//   });

//   await userInformation.save();
//   console.log(req.body.email);
//   res.sendFile(path.join(__dirname + '/login.html'));
// })


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
    console.log("the token part" + token);
  
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
// app.post('/login.html', async function (req, res) {
//   const email = req.body.email;
//   const password = req.body.password;
//   const userEmail = await register.findOne({ email: email });
//   if (userEmail == null) {
//     console.log("invalid email");
//     res.send("Invalid email");
//   } else {
//     const isMatch = bcrypt.compare(password,userEmail.password)
//     if (isMatch) {
//       res.status(201).render('home.ejs');
//     } else {
//       res.send("invalid password");
//     }
//   }
// });

app.post('/login.html', async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await register.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, userEmail.password);
    const token = await userEmail.generateAuthToken();
    console.log(token);
    if (isMatch) {
      res.status(201).render('home.ejs');

    } else {
      res.send("Invalid password details");
    }
  } catch (error) { 
    res.status(400).send("invalid login details");
  }
});

app.listen(port, function (req, res) {
  console.log("project is getting ready");
});