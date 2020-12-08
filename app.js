const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const ejs = require('ejs')
const rp = require('request-promise')
const port = 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', function (req, res) {
  res.render('index')
})

app.post('/', function (req, res) {
  const username = req.body.userId

  var options = {
    host: 'api.github.com',
    path: '/users/' + username,
    method: 'GET',
    headers: { 'user-agent': 'node.js' },
  }

  var request = https.request(options, function (response) {
    var body = ''
    response.on('data', function (chunk) {
      body += chunk.toString()
    })

    response.on('end', function () {
      res.render('profile', { userData: JSON.parse(body) })
    })
  })

  request.end()
})

app.listen(port, function () {
  console.log('Server started on port', port)
})
