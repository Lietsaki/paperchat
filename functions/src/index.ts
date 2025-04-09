import * as functions from 'firebase-functions/v1'
import * as admin from 'firebase-admin'
import { RoomMessagesObj, OnlineUser } from '../../types/Room'

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
  const publicRoomMessagesRef = db.ref('public_room_messages/')
  const privateRoomMessagesRef = db.ref('private_room_messages/')
  const publicRoomsRef = db.ref('public_rooms/')
  const privateRoomsRef = db.ref('private_rooms/')
  const onlineUsersRef = db.ref('online_users/')
  const halfAnHourAgo = Date.now() - 1800000
  const publicRoomsToDelete: string[] = []
  const privateRoomsToDelete: string[] = []

  let publicRoomsMessagesObj: RoomMessagesObj = {}
  let privateRoomsMessagesObj: RoomMessagesObj = {}
  let usersObj: { [key: string]: OnlineUser | null } = {}

  // Get all public room messages
  await publicRoomMessagesRef.once('value', (snapshot) => {
    if (!snapshot.exists()) return

    publicRoomsMessagesObj = snapshot.val()
    const roomKeys = Object.keys(publicRoomsMessagesObj)

    for (const roomKey of roomKeys) {
      const room = publicRoomsMessagesObj[roomKey]
      const lastMessage = room.messages[room.messages.length - 1]

      if (lastMessage.serverTs < halfAnHourAgo) {
        publicRoomsToDelete.push(roomKey)
      }
    }
  })

  // Get all private room messages
  await privateRoomMessagesRef.once('value', (snapshot) => {
    if (!snapshot.exists()) return

    privateRoomsMessagesObj = snapshot.val()
    const roomKeys = Object.keys(privateRoomsMessagesObj)

    for (const roomKey of roomKeys) {
      const room = privateRoomsMessagesObj[roomKey]
      const lastMessage = room.messages[room.messages.length - 1]

      if (lastMessage.serverTs < halfAnHourAgo) {
        privateRoomsToDelete.push(roomKey)
      }
    }
  })

  // Get all lingering public rooms
  await publicRoomsRef.once('value', (snapshot) => {
    if (!snapshot.exists()) return

    const publicRoomsObj = snapshot.val()
    const roomKeys = Object.keys(publicRoomsObj)

    for (const roomKey of roomKeys) {
      if (!publicRoomsMessagesObj[roomKey]) {
        publicRoomsToDelete.push(roomKey)
      }
    }
  })

  // Get all lingering private rooms
  await privateRoomsRef.once('value', (snapshot) => {
    if (!snapshot.exists()) return

    const privateRoomsObj = snapshot.val()
    const roomKeys = Object.keys(privateRoomsObj)

    for (const roomKey of roomKeys) {
      if (!privateRoomsMessagesObj[roomKey]) {
        privateRoomsToDelete.push(roomKey)
      }
    }
  })

  // Get all lingering users
  await onlineUsersRef.once('value', (snapshot) => {
    if (!snapshot.exists()) return

    usersObj = snapshot.val()
    const userKeys = Object.keys(usersObj)

    for (const userKey of userKeys) {
      const user = usersObj[userKey] as OnlineUser

      if (user.publicRooms) {
        user.publicRooms = user.publicRooms.filter((roomKey) => {
          return publicRoomsMessagesObj[roomKey] && !publicRoomsToDelete.includes(roomKey)
        })
      }

      if (user.privateRooms) {
        user.privateRooms = user.privateRooms.filter((roomKey) => {
          return privateRoomsMessagesObj[roomKey] && !privateRoomsToDelete.includes(roomKey)
        })
      }

      if (
        (!user.publicRooms || !user.publicRooms.length) &&
        (!user.privateRooms || !user.privateRooms.length)
      ) {
        usersObj[userKey] = null
      }
    }
  })

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

  const promises = [onlineUsersRef.update(usersObj)]

  if (Object.keys(updateObj).length) {
    promises.push(dbRef.update(updateObj))
  }

  return Promise.all([promises])
})
