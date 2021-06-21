require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

/* Connnect to DB */
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI
const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false

}
mongoose.connect(MONGO_URI, OPTIONS)

/* Enable body parser */
app.use(express.urlencoded({extended: true}))

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const routes = require('./api/routes')
routes(app)

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is currently listening on port ' + listener.address().port)
})