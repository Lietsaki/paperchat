import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'net.paperchat_dev.app',
  appName: 'Paperchat',
  webDir: 'out',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200
    },
    LocalNotifications: {
      smallIcon: 'paperchat_logo_32',
      iconColor: '#ffffff',
      sound: 'send_message.wav'
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true
    }
  }
}

export default config
