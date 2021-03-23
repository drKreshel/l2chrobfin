import express from "express";

const app = express()
const server = require('http').createServer(app)
const port = process.env.PORT || 8000
const path = require('path')
const io = require('socket.io')(server, /*options*/)

console.log(path.join(__dirname, '../public/'))
app.use(express.static(path.join(__dirname, '../public/')));

// just to test the server
app.get('/', (req, res) => {
  res.status(200).send('Workingg')
});


io.on('connection', (socket: any) => {
  // console.log('Some client connected')

  socket.on('chat', (message: any) => {
    console.log('From client: ', message)
  })
})

server.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})

