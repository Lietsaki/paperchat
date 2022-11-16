import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'net.paperchat_dev.app',
  appName: 'Paperchat',
  webDir: 'out',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200
    },
    LocalNotifications: {
      smallIcon: 'paperchat_logo_32',
      iconColor: '#ffffff',
      sound: 'send_message.wav'
    }
  },
  server: {
    url: 'http://192.168.1.130:3000',
    cleartext: true
  }
}

export default config
