import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { roomMessages } from '../../types/Room'

admin.initializeApp()

exports.deleteEmptyPublicRoomPictures = functions.database
  .ref('/public_rooms/{roomID}')
  .onDelete(async (snapshot, context) => {
    const roomID: string = context.params.roomID
    const bucket = admin.storage().bucket()

    return bucket.deleteFiles(
      {
        prefix: `room_messages/${roomID}/`
      },
      (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log(`Success: deleted /room_messages/${roomID}`)
        }
      }
    )
  })

exports.deleteEmptyPrivateRoomPictures = functions.database
  .ref('/private_rooms/{roomID}')
  .onDelete(async (snapshot, context) => {
    const roomID: string = context.params.roomID
    const bucket = admin.storage().bucket()

    return bucket.deleteFiles(
      {
        prefix: `room_messages/${roomID}/`
      },
      (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log(`Success: deleted /room_messages/${roomID}`)
        }
      }
    )
  })

exports.emptyRoomsCleaner = functions.pubsub.schedule('every 60 minutes').onRun(async () => {
  const db = admin.database()
  const publicRoomMessages = db.ref('public_room_messages/')
  const privateRoomMessages = db.ref('private_room_messages/')
  const halfAnHourAgo = Date.now() - 1800000
  const publicRoomsToDelete: string[] = []
  const privateRoomsToDelete: string[] = []

  // Get all public room messages
  await publicRoomMessages.once('value', (snapshot) => {
    if (!snapshot.exists()) return

    const roomsObj = snapshot.val()
    const roomKeys = Object.keys(roomsObj)

    for (const roomKey of roomKeys) {
      const room: roomMessages = roomsObj[roomKey]
      const lastMessage = room.messages[room.messages.length - 1]

      if (lastMessage.serverTs < halfAnHourAgo) {
        publicRoomsToDelete.push(roomKey)
      }
    }
  })

  // Get all private room messages
  await privateRoomMessages.once('value', (snapshot) => {
    if (!snapshot.exists()) return

    const roomsObj = snapshot.val()
    const roomKeys = Object.keys(roomsObj)

    for (const roomKey of roomKeys) {
      const room: roomMessages = roomsObj[roomKey]
      const lastMessage = room.messages[room.messages.length - 1]

      if (lastMessage.serverTs < halfAnHourAgo) {
        privateRoomsToDelete.push(roomKey)
      }
    }
  })

  if (!publicRoomsToDelete.length && !privateRoomsToDelete.length) return ''

  const dbRef = db.ref('/')
  const updateObj: { [key: string]: null } = {}

  for (const id of publicRoomsToDelete) {
    updateObj[`/public_room_messages/${id}`] = null
    updateObj[`/public_rooms/${id}`] = null
  }
  for (const id of privateRoomsToDelete) {
    updateObj[`/private_room_messages/${id}`] = null
    updateObj[`/private_rooms/${id}`] = null
  }

  return dbRef.update(updateObj)
})
