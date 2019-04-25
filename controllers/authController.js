const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');

router.get('/login', (req, res) => {
	res.render('login.ejs', {
		message: req.session.message
	})		
});

router.post('/register', async (req, res) => {
		
})