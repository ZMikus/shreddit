const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session')
require('dotenv').config()


require("./db/db")

const PORT = process.env.PORT
// middleWare
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))



app.use(methodOverride('_method'));
app.use(session({
  secret:process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}));

//controllers

const authController = require('./controllers/authController');
app.use('/auth', authController);
const shredditController = require('./controllers/shreddit');
app.use('/shreddit', shredditController);
const userController = require('./controllers/user')
app.use('/user', userController);




app.get('/', (req, res) => {
  res.render('home.ejs')
})


/// seed activities



app.listen(PORT, () => {
  console.log("server listening on 3000");
})