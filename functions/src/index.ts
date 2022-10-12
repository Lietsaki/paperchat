import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

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
