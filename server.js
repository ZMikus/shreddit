const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session')


require("./db/db")


// middleWare
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))
app.use(methodOverride('_method'));
app.use(session({
  secret: 'asdlfkjalsdkfjalsdkjfapw983u2357028euqoih23597357qjkweh',
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



app.listen(3000, () => {
  console.log("server listening on 3000");
})