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

  function getRateLimit() {
    return axios.get(`https://api.github.com/rate_limit`)
  }

  Promise.all([getUserDetails(), getUserRepos(), getRateLimit()])
    .then(function (results) {
      const userDetails = results[0]
      const userRepos = results[1]
      const reqsLeft = results[2]

      res.render('profile', {
        userDetails: userDetails.data,
        userRepos: userRepos.data,
        reqsLeft: reqsLeft.data,
      })
    })
    .catch((err) => {
      if (err.response.status === 403) {
        res.render('errors', {
          link: err.response.data.documentation_url,
        })
      } else {
        res.redirect('/')
      }
    })
})

app.listen(process.env.PORT || port, function () {
  console.log('Server started on port', port)
})
