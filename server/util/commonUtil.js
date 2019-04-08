const uuid = require('uuid')

exports.cookieParse = () => {}

exports.randomSecretKey = () => {
  return (secretKey = uuid())
}

exports.findUser = (users, id, userName) => {
  const user = users.find(u => {
    return u.userName === userName && u.id === id
  })
  return user
}
