import { LocalNotifications } from '@capacitor/local-notifications'
import { App } from '@capacitor/app'
import getT from 'i18n/getT'

// The sound specified in a channel overwrites the one specified in capacitor.config.ts
// but individual notifications (those created with .schedule) can't overwrite the channel's sound.
const createNotificationsChannel = async () => {
  await LocalNotifications.createChannel({
    id: 'paperchat_room_notifications',
    name: 'Room Notifications',
    importance: 4,
    description: 'New message notifications',
    sound: 'send_message.wav',
    lights: true,
    lightColor: '#ffffff',
    visibility: 1,
    vibration: true
  })
}

const initializeLocalNotifications = async () => {
  const permissionStatus = await LocalNotifications.checkPermissions()

  if (permissionStatus.display !== 'granted') {
    const permissionResponse = await LocalNotifications.requestPermissions()

    if (permissionResponse.display === 'granted') {
      await createNotificationsChannel()
    }
  } else {
    await createNotificationsChannel()
  }
}

const notifyNow = async (payload: {
  newMessage?: boolean
  userEntering?: string
  userLeaving?: string
}) => {
  const { isActive } = await App.getState()
  if (isActive) return

  const { newMessage, userEntering, userLeaving } = payload
  let notificationToUse = { title: '', body: '', iconColor: '' }

  if (newMessage) {
    notificationToUse = {
      title: getT('NOTIFICATIONS.NEW_ROOM_MESSAGE.TITLE'),
      body: getT('NOTIFICATIONS.NEW_ROOM_MESSAGE.BODY'),
      iconColor: '#ffffff'
    }
  } else if (userEntering) {
    notificationToUse = {
      title: getT('NOTIFICATIONS.USER_ENTERING.TITLE'),
      body: getT('NOTIFICATIONS.USER_ENTERING.BODY', { userEntering }),
      iconColor: '#ddec00'
    }
  } else if (userLeaving) {
    notificationToUse = {
      title: getT('NOTIFICATIONS.USER_LEAVING.TITLE'),
      body: getT('NOTIFICATIONS.USER_LEAVING.BODY', { userLeaving }),
      iconColor: '#18e0c5'
    }
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        ...notificationToUse,
        // This id decides if a notification overrides the last one, of it they accumulate.
        // Date.now() can be used as a simple way to stack a bunch of notifications, but
        // I'm choosing to keep it simple and show only one at a time.
        id: 1,
        channelId: 'paperchat_room_notifications'
      }
    ]
  })
}

export { initializeLocalNotifications, notifyNow }
