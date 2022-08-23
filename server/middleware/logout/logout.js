const logout = (options) => {
	const { returnTo } = options

	return (req, res, next) => {

		// TODO: delete token cookies here
		res.redirect(returnTo)

		next()
	}
}

module.exports = logout
