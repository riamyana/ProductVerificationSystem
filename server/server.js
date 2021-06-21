const express = require('express')
const bodyParser = require('body-parser')

const PORT = 3000
const userApi = require('./routes/userApi')
const app = express()

app.use(bodyParser.json())

app.use('/api', userApi)
app.get('/', function(req, res) {
  res.send('Hello from server')
})

app.listen(PORT, function() {
  console.log('Server running on localhost:' + PORT)
})
