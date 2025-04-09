import styles from 'styles/home/home.module.scss'
import Button from 'components/Button'
import { useRouter } from 'next/router'
import useTranslation from 'i18n/useTranslation'
import version from 'store/version'
import Head from 'next/head'

const {
  top,
  title,
  title_text,
  lowercase,
  privacy_and_credits,
  privacy_title,
  de,
  es,
  cat,
  cn,
  bottom,
  privacy,
  privacy_content,
  credits_content,
  privacy_back_home_btn
} = styles

const Credits = () => {
  const router = useRouter()
  const { t, locale } = useTranslation()
  const getTitleText = () => `Paperchat - ${t('HOME.CREDITS')}`

  const localeClasses: { [key: string]: string } = {
    de,
    es,
    cat,
    cn
  }

  return (
    <div className="main">
      <Head>
        <title>{getTitleText()}</title>
        <meta name="description" content="Paperchat credits" />

        <meta name="author" content="Ricardo Sandez - Lietsaki" />
        <meta
          name="keywords"
          content="paperchat credits, pictochat online, drawing online, live drawing app, nintendo pictochat, DS drawing app, by lietsaki"
        />
      </Head>

      <div className="screens_section">
        <div className={`screen ${top}`}>
          <div className={title}>
            <span
              className={`${title_text} ${lowercase} ${privacy_title} ${localeClasses[locale]}`}
            >
              {t('HOME.CREDITS')}
            </span>
          </div>

          <div className={privacy_and_credits}>
            <span>v{version}</span>
          </div>
        </div>

        <div className={`screen ${bottom} ${privacy}`}>
          <div className={`${privacy_content} scrollify scrollify-dark ${credits_content}`}>
            <h3>
              <a
                href="https://www.linkedin.com/in/ricardo-sandez/"
                target="_blank"
                rel="noreferrer"
              >
                Ricardo Sandez
              </a>{' '}
              - Application design and development
            </h3>
            <ul>
              <li>
                <a href="https://github.com/Lietsaki" target="_blank">
                  @Lietsaki on Github.
                </a>
              </li>
              <li>Paperchat was released on November 13th, 2022.</li>
            </ul>

            <h3>
              <a
                href="https://www.linkedin.com/in/aoife-duffy-1bab2a235/"
                target="_blank"
                rel="noreferrer"
              >
                Aoife Duffy
              </a>{' '}
              - Localization and translation
            </h3>
            <ul>
              <li>
                Español, Català, <span className={cn}>中文</span>, Deutsch.
              </li>
            </ul>

            <h3>Disclaimer</h3>

            <p>
              Paperchat is in no way, shape or form associated with Pictochat or Nintendo. No
              copyright infringement is intended.
            </p>
          </div>

          <div className={privacy_back_home_btn}>
            <Button onClick={() => router.push('/')} text={t('COMMON.GO_HOME')} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Credits
