const express = require('express')
const router = express.Router()
const User = require('../models/user')

const mongoose = require('mongoose')
const db = "mongodb+srv://ria:riamyana@cluster0.pws7t.mongodb.net/ProductVerification?retryWrites=true&w=majority"

mongoose.connect(db, err => {
  if (err) {
    console.error('Error!' + err)
  } else {
    console.log('Connected to mongodb')
  }
})

router.get('/', (req, res) => {
  res.send('From API route')
})

router.post('/register', (req, res) => {
  let userData = req.body
  User.findOne({ publicAddress: userData.publicAddress }, function (err, result) {
    if (err) {
      console.log("err" + err);
      res.status(422).send(err);
    } else {
      if (result) {
        res.status(401).send("User with public address already exists..!");
      } else {
        userData.nonce = Math.floor(Math.random() * 1000000);
        let user = new User(userData)
        user.save((error, registeredUser) => {
          if (error) {
            console.log(error)
          } else {
            res.status(200).send(registeredUser)
          }
        })
      }
    }
  })
})

router.post('/login', (req, res) => {
  let userData = req.body
  User.findOne({ publicAddress: userData.publicAddress }, function (err, result) {
    if (err) {
      console.log("err" + err);
      res.status(422).send(err);
    } else {
      if (!result) {
        res.status(401).send("Public address not found..!");
      } else {
        res.status(200).send(result);
      }
    }
  })
})

module.exports = router
