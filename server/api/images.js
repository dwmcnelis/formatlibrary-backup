
const router = require('express').Router()
const fs = require('fs')

module.exports = router

router.post('/create', async (req, res, next) => {
    try {
        const buffer = req.body.image.replace(/^data:image\/png;base64,/, '')
        fs.writeFileSync(`./public/images/${req.body.folder}/${req.body.fileName}`, buffer, 'base64')
      } catch (err) {
        next(err)
      }
})

