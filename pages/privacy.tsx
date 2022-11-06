import styles from 'styles/home/home.module.scss'
import Button from 'components/Button'
import { useRouter } from 'next/router'
import version from 'store/version'
import Head from 'next/head'

const { top, title, title_text, privacy_link, bottom, privacy, privacy_content, home_btn } = styles

const Home = () => {
  const router = useRouter()

  return (
    <div className="main">
      <Head>
        <title>Paperchat - Privacy Policy</title>
        <meta
          name="description"
          content="Paperchat's privacy policy, including our cookie usage."
        />

        <meta name="robots" content="noindex, nofollow" />
        <meta name="author" content="Ricardo Sandez - Lietsaki" />
        <meta
          name="keywords"
          content="paperchat privacy policy, pictochat online, drawing online, live drawing app, nintendo pictochat, DS drawing app, by lietsaki"
        />
      </Head>

      <div className="screens_section">
        <div className={`screen ${top}`}>
          <div className={title}>
            <span className={title_text}>privacy policy </span>
          </div>

          <div className={privacy_link}>
            <span>v{version}</span>
          </div>
        </div>

        <div className={`screen ${bottom} ${privacy}`}>
          <div className={`${privacy_content} scrollify scrollify-dark`}>
            <p>
              Paperchat (referred to as {`"this service"`}), is accessible from{' '}
              <a href="https://paperchat.net/" target="_blank" rel="noreferrer">
                https://paperchat.net/
              </a>{' '}
              as a web application, and also as an android application in the Google Play Store.
              This Privacy Policy document contains the types of information collected and recorded
              by Paperchat and how we use it.
            </p>

            <p>
              This Privacy Policy applies only to our online activities and is valid for our users
              with regards to the information that we share and/or collect in Paperchat. This policy
              is not applicable to any information collected offline or via channels other than this
              service.
            </p>

            <p>
              By using our service, you hereby consent to our Privacy Policy and agree to its terms.
            </p>

            <h3>Cookies & Local Data</h3>

            <p>
              We do not store or collect any personal information from users. The messages you
              exchange in chat rooms are not encrypted; {`they're`} saved as images (the canvas
              content) while the room is active, all messages are deleted after the room is
              disbanded.
            </p>

            <p>* You can download messages (images) by clicking/tapping on them.</p>

            <p>
              We use Google Analytics to improve our application through the feedback provided by
              users. You might also be shown Google Ads which are based on your browsing patterns.
              By using Paperchat you agree to these services, namely, Google Ads and Google
              Analytics.
            </p>

            <h3>Disclaimer</h3>

            <p>
              Paperchat is in no way, shape or form associated with Pictochat or Nintendo. No
              copyright infringement is intended.
            </p>

            <h3>User-Generated Content</h3>

            <p>
              Paperchat is an application where users can create or join chat rooms to exchange
              messages with each other. These messages come in the form of drawings and texts. By
              using our service you agree that Paperchat is in no way liable for user-generated
              content that might hurt your sensitivity, for instance, offensive messages or obscene
              drawings that you might encounter.
            </p>

            <h3>Log Files</h3>
            <p>
              Paperchat follows a standard procedure of using log files. These files log visitors
              when they use the app. The information collected by log files include internet
              protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time
              stamp, referring/exit pages, and possibly the number of clicks. These are not linked
              to any information that is personally identifiable. The purpose of the information is
              for analyzing trends, administering the app and tracking app performance. For example,
              IP addresses are automatically collected by {`Google's`} Firebase Analytics.
            </p>

            <h3>{`Children's`} Information</h3>
            <p>
              Paperchat does not knowingly collect any Personal Identifiable Information from
              children under the age of 13.
            </p>

            <h3>Advertising</h3>
            <p>We do not show advertising from any third parties in our app.</p>

            <h3>CCPA Privacy Rights (Do Not Sell My Personal Information)</h3>
            <p>We do not collect or sell personal information from users.</p>

            <p>
              Under the CCPA, among other rights, California consumers have the right to: Request
              that a business that collects a {`consumer's`} personal data disclose the categories
              and specific pieces of personal data that a business has collected about consumers.
              Request that a business delete any personal data about the consumer that a business
              has collected. Request that a business that sells a {`consumer's`} personal data, not
              sell the {`consumer's`} personal data. If you make a request, we have one month to
              respond to you. If you would like to exercise any of these rights, please contact us
              at whoolsodev@gmail.com
            </p>

            <h3>GDPR Data Protection Rights</h3>
            <p>
              The right to access - You have the right to request copies of your personal data,
              however, we do not collect or store personal data of any kind. The messages you send
              in a room are automatically deleted forever after the room is disbanded, and this
              happens when all users leave it.
            </p>
            <p>
              The right to rectification - You have the right to request that we correct any
              information you believe is inaccurate. You also have the right to request that we
              complete the information you believe is incomplete.
            </p>
            <p>
              The right to erasure - You have the right to request that we erase your personal data,
              under certain conditions.
            </p>
            <p>
              The right to restrict processing - You have the right to request that we restrict the
              processing of your personal data, under certain conditions.
            </p>
            <p>
              The right to object to processing - You have the right to object to our processing of
              your personal data, under certain conditions.
            </p>
            <p>
              The right to data portability - You have the right to request that we transfer the
              data that we have collected to another organization, or directly to you, under certain
              conditions.
            </p>
            <p>
              Since we do not collect user data but only log data to track our {`application's`}
              performance, we {`can't`} provide you with any copies of said information because
              there is none.
            </p>
          </div>

          <div className={home_btn}>
            <Button onClick={() => router.push('/')} text="Go Home" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
