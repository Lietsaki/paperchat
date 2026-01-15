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
const Terms = () => {
  const router = useRouter()
  const { t, locale } = useTranslation()
  const getTitleText = () => `Paperchat - ${t('HOME.TERMS_AND_CONDITIONS')}`

  return (
    <div className="main">
      <Head>
        <title>{getTitleText()}</title>
        <meta name="description" content="Paperchat's terms and conditions." />

        <meta name="author" content="Ricardo Sandez - Lietsaki" />
        <meta
          name="keywords"
          content="paperchat terms and conditions, pictochat online, drawing online, live drawing app, nintendo pictochat, DS drawing app, by lietsaki"
        />
      </Head>

      <div className="screens_section">
        <div className={`screen ${top}`}>
          <div className={title}>
            <span
              className={`${title_text} ${lowercase} ${privacy_title} ${localeClasses[locale]}`}
            >
              {t('HOME.TERMS_AND_CONDITIONS')}
            </span>
          </div>

          <div className={top_screen_bottom_right}>
            <span>v{version}</span>
          </div>
        </div>

        <div className={`screen ${bottom} ${long_text}`}>
          <div className={`${long_text_content} scrollify scrollify-dark`}>
            <h3>1. Agreement to Terms</h3>

            <p>
              By accessing or using Paperchat{' '}
              {`(referred to as "this service",
              "the app", "we", "us", or "our")`}
              , available at{' '}
              <a href="https://paperchat.net/" target="_blank" rel="noreferrer">
                https://paperchat.net/
              </a>{' '}
              as a web application and through the Google Play Store as an Android application, you
              agree to be bound by these Terms and Conditions. If you do not agree to these terms,
              please do not use this service.
            </p>

            <h3>2. Description of Service</h3>

            <p>
              Paperchat is a drawing-based chat application that allows users to communicate through
              images created on a canvas. Users can:
            </p>

            <ul>
              <li>Create or join chat rooms (public, private, or offline).</li>
              <li>Draw messages using canvas tools.</li>
              <li>Type text into the canvas using a virtual keyboard.</li>
              <li>Send canvas creations as images to other users in the chat room.</li>
            </ul>

            <h3>3. User Eligibility</h3>

            <p>
              Users must be at least 13 years of age to use this service. By using Paperchat, you
              represent and warrant that you are at least 13 years old. We do not knowingly collect
              information from children under 13 years of age.
            </p>

            <h3>4. About Rooms</h3>

            <h4>4.1 Room Types</h4>

            <ul>
              <li>Public Rooms: Open to all users.</li>
              <li>Private Rooms: Accessible only to users with the room code or link.</li>
              <li>Offline Rooms: Single-player mode for individual use.</li>
            </ul>

            <h4>4.2 Room Management</h4>

            <ul>
              <li>Chat rooms are temporary and exist only while users are active in them.</li>
              <li>
                When all users leave a room, the room is disbanded and all messages are permanently
                deleted. For this to happen, the last user must leave the room manually through the{' '}
                {`"Leave room"`} button. If not left manually (e.g. by closing the app or browser
                window), empty rooms are automatically deleted every hour, approximately.
              </li>
              <li>We do not store or archive messages after a room is disbanded.</li>
            </ul>

            <h3>5. User Conduct</h3>

            <h4>5.1 Prohibited Content</h4>

            <p>You agree not to create, upload, or share content that:</p>

            <ul>
              <li>
                Is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene,
                or otherwise objectionable.
              </li>
              <li>
                Infringes any patent, trademark, trade secret, copyright, or other proprietary
                rights.
              </li>
              <li>Contains malware, or any harmful code.</li>
              <li>Promotes illegal activities or violence.</li>
              <li>Contains sexually explicit content involving minors.</li>
              <li>Impersonates any person or entity.</li>
              <li>Violates any local, state, national, or international law.</li>
            </ul>

            <h4>5.2 Enforcement</h4>
            <p>While we do not actively monitor user-generated content, we reserve the right to:</p>

            <ul>
              <li>Remove any content that violates these terms.</li>
              <li>Suspend or terminate access to users who violate these terms.</li>
              <li>Report illegal activities to appropriate authorities.</li>
            </ul>

            <h3>6. User-Generated Content</h3>

            <h4>6.1 Responsibility</h4>

            <p>
              You are solely responsible for all drawings, text, and messages you create and share
              through Paperchat. You acknowledge that:
            </p>

            <ul>
              <li>Messages are not encrypted.</li>
              <li>Other users in the room can see your messages.</li>
              <li>You may encounter offensive or inappropriate content created by other users.</li>
              <li>
                Paperchat is not liable for user-generated content that may be offensive, harmful,
                or otherwise objectionable.
              </li>
            </ul>

            <h4>6.2 Content Rights</h4>

            <p>
              By creating and sharing content through Paperchat, you retain ownership of your
              content. However, you grant Paperchat a non-exclusive, worldwide license to display
              and transmit your content for the purposes of advertising (e.g. showing a screenshot
              in the Google Play Store or merchandise items).
            </p>

            <h3>7. Third-Party Services</h3>

            <p>
              Paperchat uses third-party services including Google Analytics for app performance and
              improvement, and Google Ads. By using Paperchat, you agree to the terms and policies
              of these third-party services.
            </p>

            <h3>8. Disclaimers and Limitation of Liability</h3>

            <h4>8.1 Service Provided {`"As Is"`}</h4>

            <p>
              Paperchat is provided on an {`"as is"`} and {`"as available"`} basis without
              warranties of any kind, either express or implied, including but not limited to
              warranties of merchantability, fitness for a particular purpose, availability, or
              non-infringement.
            </p>

            <h4>8.2 Limitation of Liability</h4>

            <p>
              To the maximum extent permitted by law, Paperchat and its owners, developers, and
              affiliates shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages, or any loss of profits or revenues, whether incurred directly or
              indirectly, or any loss of data, or other intangible losses resulting from:
            </p>

            <ul>
              <li>Your use or inability to use the service.</li>
              <li>Any interruption or cessation of transmission to or from the service.</li>
              <li>Any errors or omissions in any content.</li>
              <li>Any user-generated content or conduct of any third party.</li>
            </ul>

            <h3>9. Indemnification</h3>

            <p>
              You agree to indemnify, defend, and hold harmless Paperchat and its owners,
              developers, affiliates, and service providers from any claims, liabilities, damages,
              losses, costs, expenses, or fees arising from:
            </p>

            <ul>
              <li>Your use of the service.</li>
              <li>Your violation of these Terms and Conditions.</li>
              <li>Your violation of any rights of another party.</li>
              <li>Content you create or share through the service.</li>
            </ul>

            <h3>10. Termination</h3>

            <h4>10.1 By You</h4>
            <p>You may stop using Paperchat at any time.</p>

            <h4>10.2 By Us</h4>

            <p>
              We reserve the right to suspend or terminate your access to Paperchat at any time,
              with or without notice, for any reason, including but not limited to:
            </p>

            <ul>
              <li>Violation of these Terms and Conditions.</li>
              <li>Fraudulent, abusive, or illegal activity.</li>
              <li>Extended periods of inactivity.</li>
            </ul>

            <h3>11. Modifications to Service and Terms</h3>

            <h4>11.1 Service Changes</h4>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of Paperchat at any
              time without notice.
            </p>

            <h4>11.2 Terms Changes</h4>
            <p>
              We may revise these Terms and Conditions from time to time. The most current version
              will always be posted on our website. By continuing to use Paperchat after changes
              become effective, you agree to be bound by the revised terms.
            </p>

            <h3>12. Acknowledgment</h3>
            <p>
              By using Paperchat, you acknowledge that you have read, understood, and agree to be
              bound by these Terms and Conditions and our{' '}
              <a href="https://paperchat.net/privacy/" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>
              .
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

export default Terms
