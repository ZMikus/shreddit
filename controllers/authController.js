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
	
	const userDbEntry = {};
	userDbEntry.email = req.body.email;
	userDbEntry.password = passwordHash;
	userDbEntry.name = req.body.name;

	try{

		const existingUser = await User.findOne({'email': req.body.email});

		if(existingUser === null){
			const createdUser = await User.create(userDbEntry);
			
			req.session.logged = true;
			req.session.userDbId = createdUser._id;

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
		const foundUser = await User.findOne({email: req.body.email}).populate('plan');

		if(foundUser){
			if(bcrypt.compareSync(req.body.password, foundUser.password) === true){
				req.session.message = '';
				req.session.username = req.body.email;
				req.session.logged = true;
				req.session.userDbId = foundUser.id;
				req.session.name = req.body.name;

				res.redirect('/shreddit/summary');

			}else{
				req.session.message = "Incorrect Username/Password";
				console.log('login failed', req.session.username);
				res.redirect('/auth/login')
			}
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
});

module.exports = router;