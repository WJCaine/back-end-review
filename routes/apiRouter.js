const usersRouter = require('./usersRouter')
const topicsRouter = require('./topicsRouter')
const articlesRouter = require('./articlesRouter')
const commentsRouter = require('./commentsRouter')
const apiRouter = require('express').Router()
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/comments', commentsRouter)


module.exports = apiRouter