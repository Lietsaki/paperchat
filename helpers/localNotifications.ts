import { LocalNotifications } from '@capacitor/local-notifications'
import { App } from '@capacitor/app'

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

const notifyNow = async (payload: {
  newMessage?: boolean
  userEntering?: string
  userLeaving?: string
}) => {
  const { isActive } = await App.getState()
  if (isActive) return

  const { newMessage, userEntering, userLeaving } = payload

  const newMessageNotification = {
    title: 'New message in your room!',
    body: 'What could it be?',
    iconColor: '#ffffff'
  }

  const userEnteringNotification = {
    title: 'Somebody entered the room!',
    body: `Go say hi to ${userEntering}`,
    iconColor: '#ddec00'
  }

  const userLeavingNotification = {
    title: 'Somebody left the room',
    body: `Goodbye, ${userLeaving}`,
    iconColor: '#18e0c5'
  }

  let notificationToUse = { title: '', body: '', iconColor: '' }

  if (newMessage) {
    notificationToUse = newMessageNotification
  } else if (userEntering) {
    notificationToUse = userEnteringNotification
  } else if (userLeaving) {
    notificationToUse = userLeavingNotification
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

export { createNotificationsChannel, notifyNow }
