
const router = require('express').Router()
const {Op} = require('sequelize')
const {BlogPost} = require('../db/models')

module.exports = router

/* eslint-disable complexity */
router.get('/all', async (req, res, next) => {
  try {
    const blogposts = await BlogPost.findAll({
        where: {
            title: {[Op.not]: null}
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: [['createdAt', 'DESC']]
    })

    res.json(blogposts)
  } catch (err) {
    next(err)
  }
})

router.get('/first/:x', async (req, res, next) => {
    try {
        const blogposts = await BlogPost.findAll({
        where: {
            title: {[Op.not]: null}
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        limit: req.params.x,
        order: [['createdAt', 'DESC']]
        })
        res.json(blogposts)
    } catch (err) {
        next(err)
    }
})
  