const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const PORT = 3000
const userApi = require('./routes/userApi')
const app = express()

var corsOptions = {
  origin: 'http://localhost:4200'
}

app.use(bodyParser.json())

app.use(cors(corsOptions))
app.use('/api', userApi)
app.get('/', function(req, res) {
  res.send('Hello from server')
})

app.listen(PORT, function() {
  console.log('Server running on localhost:' + PORT)
})
