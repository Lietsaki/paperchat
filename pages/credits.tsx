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
  top_screen_bottom_right,
  privacy_title,
  de,
  es,
  pt,
  ja,
  bottom,
  long_text,
  long_text_content,
  credits_content,
  long_text_back_home_btn
} = styles

const localeClasses: { [key: string]: string } = {
  en: '',
  fr: '',
  de,
  es,
  pt,
  ja
}

const Credits = () => {
  const router = useRouter()
  const { t, locale } = useTranslation()
  const getTitleText = () => `Paperchat - ${t('HOME.CREDITS')}`

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

          <div className={top_screen_bottom_right}>
            <span>v{version}</span>
          </div>
        </div>

        <div className={`screen ${bottom} ${long_text}`}>
          <div className={`${long_text_content} scrollify scrollify-dark ${credits_content}`}>
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
              <li>
                Some translations, such as Portuguese, French, German and Japanese were obtained
                through an automated translator, so they might not be perfect.
              </li>
            </ul>

            <h3>Disclaimer</h3>

            <p>
              Paperchat is in no way, shape or form associated with Pictochat or Nintendo. No
              copyright infringement is intended.
            </p>
          </div>

          <div className={long_text_back_home_btn}>
            <Button onClick={() => router.push('/')} text={t('COMMON.GO_HOME')} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Credits
