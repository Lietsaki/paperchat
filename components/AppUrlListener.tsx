import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { App, URLOpenListenerEvent } from '@capacitor/app'
import emitter from 'helpers/MittEmitter'
import { Browser } from '@capacitor/browser'

const AppUrlListener = () => {
  const router = useRouter()

  const listenForAppLinks = () => {
    setTimeout(() => {
      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        // Example url: https://paperchat.net/room/123 - slug: /room/123
        const slug = event.url.split('.net')[1]
        if (!slug) return router.push('/')

        if (slug.startsWith('/blog')) {
          const urlFromApp = `${event.url}${event.url.includes('?') ? '&' : '?'}fromApp=true`
          return Browser.open({ url: urlFromApp })
        }

        const simpleSlugs = [
          '/create-room',
          '/find-rooms',
          '/join-room',
          '/offline-room',
          '/privacy',
          '/terms',
          '/credits'
        ]
        const simpleSlugMatch = simpleSlugs.find((simpleSlug) => slug.startsWith(simpleSlug))

        if (slug && simpleSlugMatch) {
          return router.push(slug)
        } else if (slug && slug.startsWith('/room/') && slug.length > 6) {
          // If the start of the url ('room') is the same as the current one (even with different params),
          // the nextjs router won't take us there, so we'll have to go to '/' first to bypass this.
          if (window && window.location.href.includes('/room/')) {
            router.push('/')
            setTimeout(() => {
              router.push(slug)
            }, 500)
            return
          }

          return router.push(slug)
        } else if (slug && slug.startsWith('/private-room/') && slug.length > 14) {
          if (window && window.location.href.includes('/private-room/')) {
            router.push('/')
            setTimeout(() => {
              router.push(slug)
            }, 500)
            return
          }

          return router.push(slug)
        } else {
          router.push('/')
        }
      })
    }, 400)
  }

  useEffect(() => {
    listenForAppLinks()
    emitter.on('removedAllCapacitorListeners', listenForAppLinks)

    return () => {
      emitter.off('removedAllCapacitorListeners')
    }
  }, [])

  return null
}

export default AppUrlListener
