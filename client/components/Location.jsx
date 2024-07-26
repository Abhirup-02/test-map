'use client'

import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { getLocation } from '@/utils/location';

export default function Location() {
  const [isConnected, setIsConnected] = useState(false)
  const [transport, setTransport] = useState()

  useEffect(() => {
    if (typeof window !== undefined) {
      if (socket.connected) {
        onConnect()
      }

      function onConnect() {
        console.log(socket.id)
        setIsConnected(true)
        setTransport(socket.io.engine.transport.name)

        socket.io.engine.on('upgrade', (transport) => {
          setTransport(transport.name)
        })
      }

      function onDisconnect() {
        setIsConnected(false)
        setTransport()
      }

      socket.on('connect', onConnect)
      socket.on('disconnect', onDisconnect)

      return () => {
        socket.off('connect', onConnect)
        socket.off('disconnect', onDisconnect)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== undefined) {
      socket.on('share-location', (location) => {
        console.log(location)
      })
    }
  }, [])

  function shareLocation() {
    setInterval(async () => {
      const location = await getLocation()
      socket.emit('share-location', { ...location, user: socket.id })
    }, 3000)
  }


  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <button onClick={shareLocation}>Share Location</button>
    </div>
  );
}