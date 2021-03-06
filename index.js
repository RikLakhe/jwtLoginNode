const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const commonUtil = require('./server/util/commonUtil')
const jwtUtil = require('./server/util/jwtUtil')

const app = express()

app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 8888
const users = [
  { id: 1, userName: 'admin', password: 'admin' },
  { id: 2, userName: 'guest', password: 'admin2' },
  { id: 3, userName: 'new', password: 'admin3' }
]

const key = commonUtil.randomSecretKey()

app.post('/login', (req, res) => {
  let loginTime = new Date()
  if (!req.body.userName || !req.body.password) {
    res.status(200).send('Enter need to enter username and password')
  } else {
    const user = users.find(u => {
      return (
        u.userName === req.body.userName && u.password === req.body.password
      )
    })

    if (!user) {
      res.status(401).send('user doesn not exist')
      return
    }

    token = jwtUtil.createNewToken(user, key)

    res
      .status(200)
      .cookie('X-CROS', token)
      .send({ access_token: token })
  }
})

app.get('/status', (req, res) => {
  const localTime = new Date().toLocaleTimeString()
  const token = req.headers.jwt
  const decoded = jwtUtil.decodeToken(token, key)

  if (jwtUtil.isTokenExpired(token, key)) {
    res.status(300).send(`Logged out`)
  } else {
    const user = commonUtil.findUser(users, decoded.sub, decoded.userName)
    const newToken = jwtUtil.createNewToken(user, key)

    res
      .status(200)
      .cookie('X-CROS', newToken)
      .send(`server time = ${localTime} loging with accesstoken : ${newToken} `)
  }
})

app.get('*', (req, res) => {
  res.sendStatus(404)
})

app.listen(PORT, () => {
  console.log(`Port is running in ${PORT}`)
})
