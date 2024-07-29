import express from "express"
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'node:http'

// process.loadEnvFile()
dotenv.config()

const app = express()
const httpServer = createServer(app)

app.use(cors({ origin: '*' }))
app.use(express.json())


app.get('/', (req, res) => res.json('Map API wishes you good day'))


const io = new Server(httpServer, {
    cors: process.env.FRONTEND_URL,
    allowedHeaders: ['Access-Control-Allow-Origin'],
    pingTimeout: 60000
})


io.on('connection', (socket) => {
    console.log('User Connected.')

    // user should join a room in our case i think the room should be walletID
    socket.on('share-location', (location) => {
        console.log(location);

        socket.broadcast.emit('share-location', location)
    })



    socket.on('disconnect', () => {
        console.log('User Disconnected.')
    })
})

const port = process.env.PORT || 3000
httpServer.listen(port, () => {
    console.log(`Server PORT -> ${port}`)
})