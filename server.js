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
const shredditController = require('./controllers/shreddit');
// const userController = require('./controllers/user')

app.use('/login', authController);
app.use('/shreddit', shredditController);
// app.use('/user', userController);




app.get('/', (req, res) => {
  res.render('home.ejs')
})



app.listen(3000, () => {
  console.log("server listening on 3000");
})