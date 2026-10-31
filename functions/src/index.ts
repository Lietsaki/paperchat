import { DataSnapshot, onValueDeleted, onValueUpdated } from 'firebase-functions/database'
import { onSchedule } from 'firebase-functions/scheduler'
import admin from 'firebase-admin'
import { OnlineUser, RoomMessages, RoomMessagesObj, Room, RoomUser } from '../../types/Room'
const MESSAGE_HISTORY_LIMIT = 60

admin.initializeApp()

export const deleteEmptyPublicRoomPictures = onValueDeleted('/public_rooms/{roomID}', async (e) => {
  const roomID: string = e.params.roomID
  const bucket = admin.storage().bucket()

  try {
    await bucket.deleteFiles({ prefix: `room_messages/${roomID}/` })
    console.log(`Success: deleted /room_messages/${roomID}`)
  } catch (error) {
    console.log(error)
  }
})

export const deleteEmptyPrivateRoomPictures = onValueDeleted(
  '/private_rooms/{roomID}',
  async (e) => {
    const roomID: string = e.params.roomID
    const bucket = admin.storage().bucket()

    try {
      await bucket.deleteFiles({ prefix: `room_messages/${roomID}/` })
      console.log(`Success: deleted /room_messages/${roomID}`)
    } catch (error) {
      console.log(error)
    }
  }
)

export const trimPublicRoomMessages = onValueUpdated(
  '/public_room_messages/{roomID}/messages',
  (e) => {
    if (!e.data.after.exists()) {
      return null
    }

    const messagesObj: RoomMessages['messages'] = e.data.after.val()
    const messagesArr = Object.values(messagesObj)
    if (messagesArr.length <= MESSAGE_HISTORY_LIMIT) return null

    const messagesToDelete: { [key: string]: null } = {}

    const oldMessagesArr = messagesArr
      .sort((a, b) => a.serverTs - b.serverTs)
      .slice(0, -MESSAGE_HISTORY_LIMIT)

    for (const msg of oldMessagesArr) {
      messagesToDelete[msg.id] = null
    }

    return e.data.after.ref.update(messagesToDelete)
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

    const messagesToDelete: { [key: string]: null } = {}

    const oldMessagesArr = messagesArr
      .sort((a, b) => a.serverTs - b.serverTs)
      .slice(0, -MESSAGE_HISTORY_LIMIT)

    for (const msg of oldMessagesArr) {
      messagesToDelete[msg.id] = null
    }

    return e.data.after.ref.update(messagesToDelete)
  }
)

const removeDisconnectedUsers = async (
  roomBefore: DataSnapshot,
  roomAfter: DataSnapshot,
  roomMessagesPath: string
) => {
  const usersBefore: { [key: string]: RoomUser } = roomBefore.child('users').val() || {}
  const usersAfter: { [key: string]: RoomUser } = roomAfter.child('users').val() || {}
  const roomMessagesRef = admin.database().ref(roomMessagesPath)

  for (const [userID, oldUser] of Object.entries(usersBefore)) {
    if (!oldUser.connections || !usersAfter[userID] || usersAfter[userID].connections) continue

    let mustRemoveUser = false

    await roomAfter.ref.child(`users/${userID}`).transaction((currentUser: RoomUser | null) => {
      mustRemoveUser = !!currentUser && !currentUser.connections
      return mustRemoveUser ? null : currentUser
    })

    if (!mustRemoveUser) continue

    const roomCreatedAtSnapshot = await roomMessagesRef.child('createdAt').once('value')
    if (!roomCreatedAtSnapshot.exists()) continue

    const leavingMessageRef = roomMessagesRef.child('messages').push()

    await leavingMessageRef.set({
      userLeaving: oldUser.username,
      author: userID,
      id: leavingMessageRef.key,
      serverTs: admin.database.ServerValue.TIMESTAMP,
      platform: Object.values(oldUser.connections)[0]
    })
  }
}

export const updatePublicRoomUsersNumber = onValueUpdated('/public_rooms/{roomID}', async (e) => {
  if (!e.data.after.exists()) return null

  await removeDisconnectedUsers(
    e.data.before,
    e.data.after,
    `public_room_messages/${e.params.roomID}`
  )

  return e.data.after.ref.transaction((room: Room | null) => {
    if (!room) return room
    return { ...room, usersNumber: Object.keys(room.users || {}).length }
  })
})

export const updatePrivateRoomUsersNumber = onValueUpdated('/private_rooms/{roomID}', async (e) => {
  if (!e.data.after.exists()) return null

  await removeDisconnectedUsers(
    e.data.before,
    e.data.after,
    `private_room_messages/${e.params.roomID}`
  )

  return e.data.after.ref.transaction((room: Room | null) => {
    if (!room) return room
    return { ...room, usersNumber: Object.keys(room.users || {}).length }
  })
})

export const emptyRoomsCleaner = onSchedule({ schedule: 'every 60 minutes' }, async () => {
  const db = admin.database()
  const publicRoomMessagesRef = db.ref('public_room_messages/')
  const privateRoomMessagesRef = db.ref('private_room_messages/')
  const publicRoomsRef = db.ref('public_rooms/')
  const privateRoomsRef = db.ref('private_rooms/')
  const onlineUsersRef = db.ref('online_users/')
  const halfAnHourAgo = Date.now() - 1800000
  const publicRoomsToDelete = new Set<string>()
  const privateRoomsToDelete = new Set<string>()
  const usersToDelete = new Set<string>()
  const userRoomEntriesToDelete: string[] = []

  // Get all public room messages
  const publicRoomsMessagesSnapshot = await publicRoomMessagesRef.once('value')
  const publicRoomsMessagesObj: RoomMessagesObj = publicRoomsMessagesSnapshot.val() || {}

  for (const roomKey of Object.keys(publicRoomsMessagesObj)) {
    const room = publicRoomsMessagesObj[roomKey]
    const roomMessages = Object.values(room.messages || {})
    roomMessages.sort((a, b) => a.serverTs - b.serverTs)

    const lastMessage = roomMessages[roomMessages.length - 1]

    if (lastMessage.serverTs < halfAnHourAgo) {
      publicRoomsToDelete.add(roomKey)
    }
  }

  // Get all private room messages
  const privateRoomsMessagesSnapshot = await privateRoomMessagesRef.once('value')
  const privateRoomsMessagesObj: RoomMessagesObj = privateRoomsMessagesSnapshot.val() || {}

  for (const roomKey of Object.keys(privateRoomsMessagesObj)) {
    const room = privateRoomsMessagesObj[roomKey]
    const roomMessages = Object.values(room.messages || {})
    roomMessages.sort((a, b) => a.serverTs - b.serverTs)

    const lastMessage = roomMessages[roomMessages.length - 1]

    if (lastMessage.serverTs < halfAnHourAgo) {
      privateRoomsToDelete.add(roomKey)
    }
  }

  // Get all lingering public rooms
  const publicRoomsSnapshot = await publicRoomsRef.once('value')
  const publicRoomsObj: { [key: string]: Room } = publicRoomsSnapshot.val() || {}

  for (const roomKey of Object.keys(publicRoomsObj)) {
    if (!publicRoomsMessagesObj[roomKey]) {
      publicRoomsToDelete.add(roomKey)
    }
  }

  // Get all lingering private rooms
  const privateRoomsSnapshot = await privateRoomsRef.once('value')
  const privateRoomsObj: { [key: string]: Room } = privateRoomsSnapshot.val() || {}

  for (const roomKey of Object.keys(privateRoomsObj)) {
    if (!privateRoomsMessagesObj[roomKey]) {
      privateRoomsToDelete.add(roomKey)
    }
  }

  // Get all lingering users
  const usersSnapshot = await onlineUsersRef.once('value')
  const usersObj: { [key: string]: OnlineUser } = usersSnapshot.val() || {}

  for (const userKey of Object.keys(usersObj)) {
    const user = usersObj[userKey]
    const userPublicRoomKeys = Object.keys(user.publicRooms || {})
    const userPrivateRoomKeys = Object.keys(user.privateRooms || {})

    if (user.publicRooms) {
      for (const key of userPublicRoomKeys) {
        if (
          !publicRoomsMessagesObj[key] ||
          (publicRoomsMessagesObj[key] && publicRoomsToDelete.has(key))
        ) {
          delete user.publicRooms[key]
          userRoomEntriesToDelete.push(`/online_users/${userKey}/publicRooms/${key}`)
        }
      }
    }

    if (user.privateRooms) {
      for (const key of userPrivateRoomKeys) {
        if (
          !privateRoomsMessagesObj[key] ||
          (privateRoomsMessagesObj[key] && privateRoomsToDelete.has(key))
        ) {
          delete user.privateRooms[key]
          userRoomEntriesToDelete.push(`/online_users/${userKey}/privateRooms/${key}`)
        }
      }
    }

    if (
      (!user.publicRooms || !Object.keys(user.publicRooms || {}).length) &&
      (!user.privateRooms || !Object.keys(user.privateRooms || {}).length)
    ) {
      usersToDelete.add(userKey)
    }
  }

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

  for (const path of userRoomEntriesToDelete) {
    updateObj[path] = null
  }

  try {
    if (Object.keys(updateObj).length) await dbRef.update(updateObj)

    // Delete users with no rooms after cleaning everything else
    await Promise.all(
      [...usersToDelete].map((userID) =>
        onlineUsersRef.child(userID).transaction((user: OnlineUser | null) => {
          if (!user) return user

          const hasRooms =
            Object.keys(user.publicRooms || {}).length ||
            Object.keys(user.privateRooms || {}).length

          return hasRooms ? user : null
        })
      )
    )

    console.log(
      `Cleaned ${publicRoomsToDelete.size} public rooms, ${privateRoomsToDelete.size} private rooms and ${usersToDelete.size} users.`
    )
  } catch (error) {
    console.log('Error cleaning rooms!')
    console.log(error)
  }
})
