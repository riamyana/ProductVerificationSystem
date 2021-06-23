const express = require('express')
const router = express.Router()
const User = require('../models/user')
const sigUtil = require('eth-sig-util')
const ethUtil = require('ethereumjs-util')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
// const db = "mongodb+srv://ria:riamyana@cluster0.pws7t.mongodb.net/ProductVerification?retryWrites=true&w=majority"

const db = "mongodb+srv://ria:riamyana@cluster0.fazwr.mongodb.net/ProductVerification?retryWrites=true&w=majority"

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
            let payload = { subject: registeredUser._id };
            let token = jwt.sign(payload, 'DAppsecretKey');

            responseData = { 'role': registeredUser.userRole };
            responseData['token'] = token;
            responseData.userName = registeredUser.userName;
            responseData.manufacturerName = registeredUser.manufacturerName;
            responseData.companyOrFullName = registeredUser.companyOrFullName;
            responseData.userRole = registeredUser.userRole;
            responseData.email = registeredUser.email;
            res.status(200).send(responseData);
          }
        })
      }
    }
  })
})

router.post('/login', (req, res) => {
  let userData = req.body
  User.findOne({ publicAddress: userData.publicAddress }, function (err, user) {
    if (err) {
      console.log("err" + err);
      res.status(422).send(err);
    } else {
      if (!user) {
        res.status(401).send("Public address not found..!");
      } else {
        res.status(200).send(user);
      }
    }
  })
})

router.post('/authenticate', (req, res) => {
  let userData = req.body
  User.findOne({ publicAddress: userData.publicAddress }, function (err, user) {
    if (err) {
      console.log("err" + err);
      res.status(422).send(err);
    } else {
      if (!user) {
        res.status(401).send("Public address not found..!");
      } else {
        const msg = `I am signing my one-time nonce: ${user.nonce}`;
        const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
        const address = sigUtil.recoverPersonalSignature({
          data: msgBufferHex,
          sig: userData.signature
        }, function (err, response) {
          if (err) {
            return res.status(401).send({ error: 'Signature verification failed' });
          } else {
            return response;
          }
        });

        if (address.toLowerCase() === userData.publicAddress.toLowerCase()) {
          let payload = { subject: user._id };
          let token = jwt.sign(payload, 'DAppsecretKey');
          responseData = { 'role': user.userRole };
          responseData['token'] = token;
          responseData.userName = user.userName;
          responseData.companyOrFullName = user.companyOrFullName;
          responseData.manufacturerName = registeredUser.manufacturerName;
          responseData.userRole = user.userRole;
          responseData.email = user.email;
          res.status(200).send(responseData);

          userData.nonce = Math.floor(Math.random() * 1000000);
          User.updateOne({ publicAddress: userData.publicAddress }, { nonce: userData.nonce }, function (err, response) {
            if (err) {
              return res.status(401).send({ error: 'Problem in updating new nonce' });
            }
          })
        } else {
          return res.status(401).send({ error: 'Signature verification failed' });
        }
      }
    }
  })
})

router.post('/update-profile', (req, res) => {
  let userData = req.body
  User.findOne({ publicAddress: userData.publicAddress }, function (err, user) {
    if (err) {
      console.log("err" + err);
      res.status(422).send(err);
    } else {
      if (!user) {
        res.status(401).send("Public address not found..!");
      } else {
        User.updateMany({ publicAddress: userData.publicAddress }, {
          $set:
            { userName: userData.userName, email: userData.email, companyOrFullName: userData.companyOrFullName }
        }, { multi: true }, function (err, user) {
          if (err) {
            return res.status(401).send({ error: 'Problem in updating new nonce' });
          } else {
            let payload = { subject: user._id };
            let token = jwt.sign(payload, 'DAppsecretKey');
            responseData = { 'role': user.userRole };
            responseData['token'] = token;
            responseData.userName = user.userName;
            responseData.manufacturerName = registeredUser.manufacturerName;
            responseData.companyOrFullName = user.companyOrFullName;
            responseData.userRole = user.userRole;
            responseData.email = user.email;

            return res.status(200).send(responseData);
          }
        })
      }
    }
  })
})

module.exports = router
