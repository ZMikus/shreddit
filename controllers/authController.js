const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

//GET : Login Form
router.get('/login', (req, res) => {
	res.render('login.ejs', {
		message: req.session.message
	})		
});

//GET : Registration Form
router.get('/register', (req, res) => {
	
	res.render('register.ejs', {
		message: req.session.message
	})		
});

//POST : Registration Form
router.post('/register', async (req, res) => {

	const password = req.body.password;
	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
	console.log('this is req.session');
	console.log(req.session);
	
	const userDbEntry = {};
	userDbEntry.email = req.body.email;
	userDbEntry.password = passwordHash;
	userDbEntry.name = req.body.name;
	


	try{

		const existingUser = await User.findOne({'email': req.body.email});

		if(existingUser === null){
			const createdUser = await User.create(userDbEntry);
			
			req.session.logged = true;
			req.session.usersDbId = createdUser._id;

			console.log(createdUser);

			res.redirect('/shreddit/select-plan');

		}else{
			req.session.message = "Account with that e-mail is already registered. Please log-in";
			res.redirect('/auth/login');
		}
	} catch(err){
		res.send(err)
	}
});


//POST : Login Form
router.post('/login', async (req, res, next) => {

	try{
		console.log('\nreq.body in login route:');
		const foundUser = await User.findOne({email: req.body.email}).populate('plan');

		console.log("\n here's the foundUser, should not be null");
		console.log(foundUser);

		if(foundUser){
			if(bcrypt.compareSync(req.body.password, foundUser.password) === true){
				req.session.message = '';
				req.session.username = req.body.email;
				req.session.logged = true;
				req.session.userDbId = foundUser.id;
				req.session.name = req.body.name;
				
				console.log(req.session, 'successful login');
				res.redirect('/shreddit/summary');

			}else{
				req.session.message = "Incorrect Username/Password";
				console.log('login failed'. req.session.username);
				res.redirect('/')
			}
		}else{
			req.session.message = "Incorrect Username/Password";

			res.redirect('/');
			console.log('login failed');
		}
		

	}catch(err){
		next(err)
	}
});

//GET : Logout 
router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if(err){
			res.send(err);
			console.log('logout failed');

		}else {
			res.redirect('/')
			console.log('user logged out');
		}
	})		
})
module.exports = router;

