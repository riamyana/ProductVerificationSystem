const mongoose = require('mongoose')

const schema =  mongoose.Schema
const userSchema = new schema({
  publicAddress: String,
  userName: String,
  email: String,
  userRole: String,
  companyOrFullName: String,
  nonce: String
})

module.exports = mongoose.model('user', userSchema, 'users')
