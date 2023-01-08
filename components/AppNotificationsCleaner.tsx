import { useEffect } from 'react'
import { App } from '@capacitor/app'
import { LocalNotifications } from '@capacitor/local-notifications'
import emitter from 'helpers/MittEmitter'

const NotificationsCleaner = () => {
  const listenForStateChanges = () => {
    setTimeout(() => {
      App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          LocalNotifications.removeAllDeliveredNotifications()
        }
      })
    }, 400)
  }

  useEffect(() => {
    listenForStateChanges()
    emitter.on('removedAllCapacitorListeners', listenForStateChanges)

    return () => {
      emitter.off('removedAllCapacitorListeners')
    }
  }, [])

  return null
}

export default NotificationsCleaner
