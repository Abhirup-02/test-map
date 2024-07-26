import express from "express"
import { Server } from 'socket.io'

process.loadEnvFile()

const app = express()

const port = process.env.PORT
const server = app.listen(port, () => {
    console.log(`Server PORT -> ${port}`)
})

const io = new Server(server, {
    pingTimeout: 60000,
    cors: '*'
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