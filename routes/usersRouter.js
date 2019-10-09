const { getUser } = require('../controllers/usersController')
const usersRouter = require('express').Router()

usersRouter.route('/:username').get(getUser)

module.exports = usersRouter