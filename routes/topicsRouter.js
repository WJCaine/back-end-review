const { getTopics } = require('../controllers/topicsController')
const topicsRouter = require('express').Router()

topicsRouter.route('/').get(getTopics)



module.exports = topicsRouter