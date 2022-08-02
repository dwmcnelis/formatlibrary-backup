const router = require('express').Router()

router.get('/login', async (req, res, next) => {
	res.render('auth/login', {
		app: 'Format Library',
		title: 'Login',
		providers: []
	})
})

//router.post('/login', login)

router.get('/signup', async (req, res, next) => {
	res.render('auth/signup', {
		app: 'Format Library',
		title: 'Signup',
		providers: [],
		firstName: '',
		lastName: '',
		email: '',
		newPassword: '',
		confirmPassword: ''
	})
})

//router.post('/signup', signup)

module.exports = router
