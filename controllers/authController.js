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
	userDbEntry.email = req.body.email;
	userDbEntry.password = passwordHash

	try{
		const createdUser = await User.create(userDbEntry);

		req.session.logged = true;
		req.session.usersDbId = createdUser._id;

		res.redirect('/shreddit');
		console.log("THIS IS IT!!");
	} catch(err){
		res.send(err)
	}
});

router.post('/', async (req, res, next) => {
	try{
		console.log('\nreq.body in login route:');
		const foundUser = await User.findOne({email: req.body.email});
		
		console.log("\n here's the foundUser, should not be null");
		console.log(foundUser);

		if(foundUser){
			if(bcrypt.compareSync(req.body.password, foundUser.password) === true){
				req.session.message = '';
				req.session.username = req.body.email;
				req.session.logged = true;
				req.session.userDbId = foundUser.id;

				console.log(req.session, 'successful login');
				res.redirect('/shreddit');

			}else{
				req.session.message = "Incorrect Username/Password";
				console.log('login failed'. req.session.username);
				res.redirect('/')
			}
		}else{
			req.session.message = "Incorrect Username/Password";
			console.log();
				// console.log('login failed req.session.username', req.session.username);
				// console.log('login failed foundUser.password', foundUser.password);
				// console.log('login failed req.session.userDbId', req.session.userDbId)

			res.redirect('/');
			console.log('login failed');
		}
		

	}catch(err){
		next(err)
	}
});

router.get('/shreddit/logout', (req, res) => {
	req.session.destroy((err) => {
		if(err){
			res.send(err);

		}else {
			res.redirect('/')
		}
	})		
})
module.exports = router;


