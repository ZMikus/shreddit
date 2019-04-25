const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.get('/test', (req, res) => {
	console.log('==========');	
	console.log(req.session);
	console.log('==========');
	req.session.myOwnPropertyIMadeUP = 'Cheese';
	console.log('req.session')
	console.log('===========');	
	res.send('hi test')
})

router.get('/', (req, res) => {
	res.render('login.ejs', {
		message: req.session.message
	})		
});

router.get('/register', (req, res) => {
	
	res.render('register.ejs', {
		message: req.session.message
	})		
});

router.post('/register', async (req, res) => {
	console.log("\n jhere is req.body in the register route:");
	console.log(req.body);
	const password = req.body.password;
	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
	console.log('=============');
	console.log(req.session);
	console.log('=============');
	const userDbEntry = {};
	userDbEntry.username = req.body.username;
	userDbEntry.password = passwordHash

	try{
		const createdUser = await User.create(userDbEntry);

		req.session.logged = true;
		req.session.usersDbId = createdUser._id;

		res.redirect('/shreddit');
	} catch(err){
		res.send(err)
	}
});

router.post('/', async (req, res) => {
	try{
		const foundUser = await User.findOne({'username': req.body.username});

		if(foundUser){
			if(bcrypt.compareSync(req.body.password, foundUser.password) === true){
				res.session.message = ' ';
				req.sessionl.logged = true;
				req.session.userDbId = foundUser.id;

				console.log(req.session, 'successful login');
				res.redirect('/shreddit');

			}else{
				req.session.message = "Incorrect Username/Password";
				res.redirect('/')
			}
		}else{
			req.session.message = "Incorrect Username/Password";

			res.redirect('/');
			}
		

	}catch(err){
		res.send(err)
	}
});


module.exports = router;


