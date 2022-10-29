import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'net.paperchat_dev.app',
  appName: 'Paperchat',
  webDir: 'out',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200
    }
  }
}

export default config
