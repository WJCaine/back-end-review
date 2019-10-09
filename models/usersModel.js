const connection = require('../db/connection')

exports.selectUser = ({ username }) => {
  return connection.select('*').from('users').where('username', username).then(user => {
    if (!user.length) return Promise.reject({ msg: 'User not found', status: 404 })
    else return user[0]
  })

}
