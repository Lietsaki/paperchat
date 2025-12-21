import { onValueDeleted, onValueUpdated } from 'firebase-functions/database'
import { onSchedule } from 'firebase-functions/scheduler'
import admin from 'firebase-admin'
import { OnlineUser, RoomMessages, RoomMessagesObj, Room } from '../../types/Room'
const MESSAGE_HISTORY_LIMIT = 40

admin.initializeApp()

export const deleteEmptyPublicRoomPictures = onValueDeleted('/public_rooms/{roomID}', (e) => {
  const roomID: string = e.params.roomID
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

export const deleteEmptyPrivateRoomPictures = onValueDeleted('/private_rooms/{roomID}', (e) => {
  const roomID: string = e.params.roomID
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

export const trimPublicRoomMessages = onValueUpdated(
  '/public_room_messages/{roomID}/messages',
  (e) => {
    if (!e.data.after.exists()) {
      return null
    }

    const messagesObj: RoomMessages['messages'] = e.data.after.val()
    const messagesArr = Object.values(messagesObj)
    if (messagesArr.length <= MESSAGE_HISTORY_LIMIT) return null

    const updatedMessages: RoomMessages['messages'] = {}

    const roomMessagesArr = messagesArr
      .sort((a, b) => a.serverTs - b.serverTs)
      .slice(-MESSAGE_HISTORY_LIMIT)

    for (const msg of roomMessagesArr) {
      updatedMessages[msg.id] = msg
    }

    console.log(`[PUBLIC ROOM] Trimming messages of ${e.params.roomID}`)

    return e.data.after.ref.set(updatedMessages)
  }
)

export const trimPrivateRoomMessages = onValueUpdated(
  '/private_room_messages/{roomID}/messages',
  (e) => {
    if (!e.data.after.exists()) {
      return null
    }

    const messagesObj: RoomMessages['messages'] = e.data.after.val()
    const messagesArr = Object.values(messagesObj)
    if (messagesArr.length <= MESSAGE_HISTORY_LIMIT) return null

    const updatedMessages: RoomMessages['messages'] = {}

    const roomMessagesArr = messagesArr
      .sort((a, b) => a.serverTs - b.serverTs)
      .slice(-MESSAGE_HISTORY_LIMIT)

    for (const msg of roomMessagesArr) {
      updatedMessages[msg.id] = msg
    }

    console.log(`[PRIVATE ROOM] Trimming messages of ${e.params.roomID}`)

    return e.data.after.ref.set(updatedMessages)
  }
)

export const updatePublicRoomUsersNumber = onValueUpdated('/public_rooms/{roomID}', (e) => {
  if (!e.data.after.exists()) return null

  if (!e.data.after.child('users').exists()) {
    return e.data.after.ref.child('usersNumber').set(0)
  }

  const usersObj: Room['users'] = e.data.after.child('users').val()
  return e.data.after.ref.child('usersNumber').set(Object.keys(usersObj || {}).length)
})

export const updatePrivateRoomUsersNumber = onValueUpdated('/private_rooms/{roomID}', (e) => {
  if (!e.data.after.exists()) return null

  if (!e.data.after.child('users').exists()) {
    return e.data.after.ref.child('usersNumber').set(0)
  }

  const usersObj: Room['users'] = e.data.after.child('users').val()
  return e.data.after.ref.child('usersNumber').set(Object.keys(usersObj || {}).length)
})

export const emptyRoomsCleaner = onSchedule({ schedule: 'every 60 minutes' }, async () => {
  const db = admin.database()
  const publicRoomMessagesRef = db.ref('public_room_messages/')
  const privateRoomMessagesRef = db.ref('private_room_messages/')
  const publicRoomsRef = db.ref('public_rooms/')
  const privateRoomsRef = db.ref('private_rooms/')
  const onlineUsersRef = db.ref('online_users/')
  const halfAnHourAgo = Date.now() - 1800000
  const publicRoomsToDelete: string[] = []
  const privateRoomsToDelete: string[] = []
  const usersToDelete: string[] = []

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
      const roomMessages = Object.values(room.messages || {})
      roomMessages.sort((a, b) => a.serverTs - b.serverTs)

      const lastMessage = roomMessages[roomMessages.length - 1]

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
      const roomMessages = Object.values(room.messages || {})
      roomMessages.sort((a, b) => a.serverTs - b.serverTs)

      const lastMessage = roomMessages[roomMessages.length - 1]

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
      const userPublicRoomKeys = Object.keys(user.publicRooms || {})
      const userPrivateRoomKeys = Object.keys(user.privateRooms || {})

      if (user.publicRooms) {
        for (const key of userPublicRoomKeys) {
          if (publicRoomsMessagesObj[key] && publicRoomsToDelete.includes(key)) {
            delete user.publicRooms[key]
          }
        }
      }

      if (user.privateRooms) {
        for (const key of userPrivateRoomKeys) {
          if (privateRoomsMessagesObj[key] && privateRoomsToDelete.includes(key)) {
            delete user.privateRooms[key]
          }
        }
      }

      if (
        (!user.publicRooms || !Object.keys(user.publicRooms || {}).length) &&
        (!user.privateRooms || !Object.keys(user.privateRooms || {}).length)
      ) {
        usersObj[userKey] = null
        usersToDelete.push(userKey)
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

  try {
    await Promise.all([promises])
    console.log(
      `Cleaned ${publicRoomsToDelete.length} public rooms, ${privateRoomsToDelete.length} private rooms and ${usersToDelete.length} users.`
    )
  } catch (error) {
    console.log('Error cleaning rooms!')
    console.log(error)
  }
})
