const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const ejs = require('ejs')
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

  function getUserDetails() {
    return axios.get(`https://api.github.com/users/${username}`)
  }

  function getUserRepos() {
    return axios.get(`https://api.github.com/users/${username}/repos`)
  }

  Promise.all([getUserDetails(), getUserRepos()])
    .then(function (results) {
      const userDetails = results[0]
      const userRepos = results[1]
      // console.log(userRepos.data[0].name)
      // console.log(userDetails.data)
      if (userDetails.status === 200) {
        res.render('profile', {
          userDetails: userDetails.data,
          userRepos: userRepos.data,
        })
      } else if (userDetails.status === 403) {
        res.render('errors')
      } else {
        res.redirect('/')
      }
    })
    .catch((err) => console.log(err))
})

app.listen(port, function () {
  console.log('Server started on port', port)
})
