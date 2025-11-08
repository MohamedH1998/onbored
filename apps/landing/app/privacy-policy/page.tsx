export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="border-b border-gray-200 pb-8 mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last updated: January 15, 2025
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed mb-6">
              This Privacy Policy describes our policies and procedures on the
              collection, use and disclosure of your information when you use
              the Service and tells you about your privacy rights and how the
              law protects you.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We use your personal data to provide and improve the Service. By
              using the Service, you agree to the collection and use of
              information in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Interpretation and Definitions */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-6 border-b border-gray-100 pb-2">
              Interpretation and Definitions
            </h2>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Interpretation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                The words of which the initial letter is capitalized have
                meanings defined under the following conditions. The following
                definitions shall have the same meaning regardless of whether
                they appear in singular or in plural.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Definitions
              </h3>
              <p className="text-gray-600 mb-4">
                For the purposes of this Privacy Policy:
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">"Account"</h4>
                  <p className="text-gray-600 text-sm">
                    means a unique account created for you to access our Service
                    or parts of our Service.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">"Company"</h4>
                  <p className="text-gray-600 text-sm">
                    (referred to as either "the Company", "We", "Us" or "Our" in
                    this Agreement) refers to Onbored, a participatory
                    grant-making platform.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">"Cookies"</h4>
                  <p className="text-gray-600 text-sm">
                    are small files that are placed on your computer, mobile
                    device or any other device by a website, containing the
                    details of your browsing history on that website among its
                    many uses.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">"Device"</h4>
                  <p className="text-gray-600 text-sm">
                    means any device that can access the Service such as a
                    computer, a cell phone or a digital tablet.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    "Personal Data"
                  </h4>
                  <p className="text-gray-600 text-sm">
                    is any information that relates to an identified or
                    identifiable individual.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">"Service"</h4>
                  <p className="text-gray-600 text-sm">
                    refers to the Onbored platform and Website.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    "Service Provider"
                  </h4>
                  <p className="text-gray-600 text-sm">
                    means any natural or legal person who processes the data on
                    behalf of the Company. It refers to third-party companies or
                    individuals employed by the Company to facilitate the
                    Service, to provide the Service on behalf of the Company, to
                    perform services related to the Service or to assist the
                    Company in analyzing how the Service is used.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    "Usage Data"
                  </h4>
                  <p className="text-gray-600 text-sm">
                    refers to data collected automatically, either generated by
                    the use of the Service or from the Service infrastructure
                    itself (for example, the duration of a page visit).
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">"Website"</h4>
                  <p className="text-gray-600 text-sm">
                    refers to Onbored, accessible from {process.env.APP_URL}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">"You"</h4>
                  <p className="text-gray-600 text-sm">
                    means the individual accessing or using the Service, or the
                    company, or other legal entity on behalf of which such
                    individual is accessing or using the Service, as applicable.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Collecting and Using Personal Data */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-6 border-b border-gray-100 pb-2">
              Collecting and Using Your Personal Data
            </h2>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Types of Data Collected
              </h3>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Personal Data
                </h4>
                <p className="text-gray-600 mb-3">
                  While using our Service, we may ask you to provide us with
                  certain personally identifiable information that can be used
                  to contact or identify you. Personally identifiable
                  information may include, but is not limited to:
                </p>
                <ul className="text-gray-600 text-sm space-y-1 ml-4">
                  <li>• Email address</li>
                  <li>• First name and last name</li>
                  <li>• Phone number</li>
                  <li>• Organization name and details</li>
                  <li>• Usage Data</li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Grant Application Data
                </h4>
                <p className="text-gray-600 mb-3">
                  If you are submitting or managing grant applications through
                  our Service, we may collect:
                </p>
                <ul className="text-gray-600 text-sm space-y-1 ml-4">
                  <li>• Project descriptions and summaries</li>
                  <li>• Requested funding amounts</li>
                  <li>• Organization size and location information</li>
                  <li>• Application tags and categorizations</li>
                  <li>• Comments and discussions related to applications</li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Panelist Data
                </h4>
                <p className="text-gray-600 mb-3">
                  If you are a panelist participating in funding decisions, we
                  may collect:
                </p>
                <ul className="text-gray-600 text-sm space-y-1 ml-4">
                  <li>• Demographic information (as provided)</li>
                  <li>• Voting and scoring preferences</li>
                  <li>• Application rankings and comments</li>
                  <li>• Panel meeting participation data</li>
                  <li>• Member ID from integrated platforms (e.g., Plinth)</li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Usage Data</h4>
                <p className="text-gray-600 mb-3">
                  Usage Data is collected automatically when using the Service.
                </p>
                <p className="text-gray-600 mb-3">
                  Usage Data may include information such as your Device's
                  Internet Protocol address (e.g. IP address), browser type,
                  browser version, the pages of our Service that you visit, the
                  time and date of your visit, the time spent on those pages,
                  unique device identifiers and other diagnostic data.
                </p>
                <p className="text-gray-600">
                  When you access the Service by or through a mobile device, we
                  may collect certain information automatically, including, but
                  not limited to, the type of mobile device you use, your mobile
                  device unique ID, the IP address of your mobile device, your
                  mobile operating system, the type of mobile Internet browser
                  you use, unique device identifiers and other diagnostic data.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tracking Technologies and Cookies
              </h3>
              <p className="text-gray-600 mb-4">
                We use Cookies and similar tracking technologies to track the
                activity on our Service and store certain information. Tracking
                technologies used are beacons, tags, and scripts to collect and
                track information and to improve and analyze our Service. The
                technologies we use may include:
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Cookies or Browser Cookies
                  </h4>
                  <p className="text-gray-600 text-sm">
                    A cookie is a small file placed on your Device. You can
                    instruct your browser to refuse all Cookies or to indicate
                    when a Cookie is being sent. However, if you do not accept
                    Cookies, you may not be able to use some parts of our
                    Service. Unless you have adjusted your browser setting so
                    that it will refuse Cookies, our Service may use Cookies.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Web Beacons
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Certain sections of our Service and our emails may contain
                    small electronic files known as web beacons (also referred
                    to as clear gifs, pixel tags, and single-pixel gifs) that
                    permit the Company, for example, to count users who have
                    visited those pages or opened an email and for other related
                    website statistics (for example, recording the popularity of
                    a certain section and verifying system and server
                    integrity).
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                Cookies can be "Persistent" or "Session" Cookies. Persistent
                Cookies remain on your personal computer or mobile device when
                you go offline, while Session Cookies are deleted as soon as you
                close your web browser.
              </p>

              <p className="text-gray-600 mb-4">
                We use both Session and Persistent Cookies for the purposes set
                out below:
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Necessary / Essential Cookies
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Type: Session Cookies
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    Administered by: Us
                  </p>
                  <p className="text-gray-600 text-sm">
                    Purpose: These Cookies are essential to provide you with
                    services available through the Website and to enable you to
                    use some of its features. They help to authenticate users
                    and prevent fraudulent use of user accounts. Without these
                    Cookies, the services that you have asked for cannot be
                    provided, and we only use these Cookies to provide you with
                    those services.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Cookies Policy / Notice Acceptance Cookies
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Type: Persistent Cookies
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    Administered by: Us
                  </p>
                  <p className="text-gray-600 text-sm">
                    Purpose: These Cookies identify if users have accepted the
                    use of cookies on the Website.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Functionality Cookies
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Type: Persistent Cookies
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    Administered by: Us
                  </p>
                  <p className="text-gray-600 text-sm">
                    Purpose: These Cookies allow us to remember choices you make
                    when you use the Website, such as remembering your login
                    details or language preference. The purpose of these Cookies
                    is to provide you with a more personal experience and to
                    avoid you having to re-enter your preferences every time you
                    use the Website.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Tracking and Performance Cookies
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Type: Persistent Cookies
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    Administered by: Third-Parties
                  </p>
                  <p className="text-gray-600 text-sm">
                    Purpose: These Cookies are used to track information about
                    traffic to the Website and how users use the Website. The
                    information gathered via these Cookies may directly or
                    indirectly identify you as an individual visitor. This is
                    because the information collected is typically linked to a
                    pseudonymous identifier associated with the device you use
                    to access the Website. We may also use these Cookies to test
                    new pages, features or new functionality of the Website to
                    see how our users react to them.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Use of Personal Data */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-6 border-b border-gray-100 pb-2">
              Use of Your Personal Data
            </h2>
            <p className="text-gray-600 mb-4">
              The Company may use Personal Data for the following purposes:
            </p>
            <ul className="text-gray-600 space-y-3">
              <li>
                • <strong>To provide and maintain our Service,</strong>{" "}
                including to monitor the usage of our Service.
              </li>
              <li>
                • <strong>To manage your Account:</strong> to manage your
                registration as a user of the Service. The Personal Data you
                provide can give you access to different functionalities of the
                Service that are available to you as a registered user.
              </li>
              <li>
                • <strong>For the performance of a contract:</strong> the
                development, compliance and undertaking of the purchase contract
                for the products, items or services you have purchased or of any
                other contract with us through the Service.
              </li>
              <li>
                • <strong>To contact you:</strong> To contact you by email,
                telephone calls, SMS, or other equivalent forms of electronic
                communication, such as a mobile application's push notifications
                regarding updates or informative communications related to the
                functionalities, products or contracted services, including the
                security updates, when necessary or reasonable for their
                implementation.
              </li>
              <li>
                • <strong>To provide you with news,</strong> special offers and
                general information about other goods, services and events which
                we offer that are similar to those that you have already
                purchased or enquired about unless you have opted not to receive
                such information.
              </li>
              <li>
                • <strong>To manage your requests:</strong> To attend and manage
                your requests to us.
              </li>
              <li>
                • <strong>To facilitate grant-making processes:</strong> To
                enable foundation staff to review applications, panelists to
                participate in voting and ranking, and to generate analytics and
                reports on funding decisions.
              </li>
              <li>
                • <strong>For business transfers:</strong> We may use your
                information to evaluate or conduct a merger, divestiture,
                restructuring, reorganization, dissolution, or other sale or
                transfer of some or all of our assets, whether as a going
                concern or as part of bankruptcy, liquidation, or similar
                proceeding, in which Personal Data held by us about our Service
                users is among the assets transferred.
              </li>
              <li>
                • <strong>For other purposes:</strong> We may use your
                information for other purposes, such as data analysis,
                identifying usage trends, determining the effectiveness of our
                promotional campaigns and to evaluate and improve our Service,
                products, services, marketing and your experience.
              </li>
            </ul>

            <p className="text-gray-600 mb-4 mt-6">
              We may share your personal information in the following
              situations:
            </p>
            <ul className="text-gray-600 space-y-3">
              <li>
                • <strong>With Service Providers:</strong> We may share your
                personal information with Service Providers to monitor and
                analyze the use of our Service, for payment processing, to
                contact you. This includes authentication services (Clerk),
                database hosting (Supabase), payment processing (Stripe),
                real-time communication services (Socket.io), and analytics
                services (Vercel Analytics).
              </li>
              <li>
                • <strong>For business transfers:</strong> We may share or
                transfer your personal information in connection with, or during
                negotiations of, any merger, sale of Company assets, financing,
                or acquisition of all or a portion of our business to another
                company.
              </li>
              <li>
                • <strong>With Affiliates:</strong> We may share your
                information with our affiliates, in which case we will require
                those affiliates to honor this Privacy Policy. Affiliates
                include our parent company and any other subsidiaries, joint
                venture partners or other companies that we control or that are
                under common control with us.
              </li>
              <li>
                • <strong>With business partners:</strong> We may share your
                information with our business partners to offer you certain
                products, services or promotions.
              </li>
              <li>
                • <strong>With other users:</strong> when you share personal
                information or otherwise interact in the public areas with other
                users, such information may be viewed by all users and may be
                publicly distributed outside. If you interact with other users
                or register through a Third-Party Social Media Service, your
                contacts on the Third-Party Social Media Service may see your
                name, profile, pictures and description of your activity.
              </li>
              <li>
                • <strong>Within your organization:</strong> If you are part of
                an organization account, your activity data, comments, and
                voting preferences may be visible to other members of your
                organization with appropriate permissions.
              </li>
              <li>
                • <strong>With your consent:</strong> We may disclose your
                personal information for any other purpose with your consent.
              </li>
            </ul>
          </section>

          {/* Retention */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-6 border-b border-gray-100 pb-2">
              Retention of Your Personal Data
            </h2>
            <p className="text-gray-600 mb-4">
              The Company will retain your Personal Data only for as long as is
              necessary for the purposes set out in this Privacy Policy. We will
              retain and use your Personal Data to the extent necessary to
              comply with our legal obligations (for example, if we are required
              to retain your data to comply with applicable laws), resolve
              disputes, and enforce our legal agreements and policies.
            </p>
            <p className="text-gray-600">
              The Company will also retain Usage Data for internal analysis
              purposes. Usage Data is generally retained for a shorter period of
              time, except when this data is used to strengthen the security or
              to improve the functionality of our Service, or we are legally
              obligated to retain this data for longer time periods.
            </p>
          </section>

          {/* Transfer */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-6 border-b border-gray-100 pb-2">
              Transfer of Your Personal Data
            </h2>
            <p className="text-gray-600 mb-4">
              Your information, including Personal Data, is processed at the
              Company's operating offices and in any other places where the
              parties involved in the processing are located. It means that this
              information may be transferred to and maintained on computers
              located outside of your state, province, country or other
              governmental jurisdiction where the data protection laws may
              differ than those from your jurisdiction.
            </p>
            <p className="text-gray-600 mb-4">
              Your consent to this Privacy Policy followed by your submission of
              such information represents your agreement to that transfer.
            </p>
            <p className="text-gray-600">
              The Company will take all steps reasonably necessary to ensure
              that your data is treated securely and in accordance with this
              Privacy Policy and no transfer of your Personal Data will take
              place to an organization or a country unless there are adequate
              controls in place including the security of your data and other
              personal information.
            </p>
          </section>

          {/* Disclosure */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-6 border-b border-gray-100 pb-2">
              Disclosure of Your Personal Data
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Business Transactions
              </h3>
              <p className="text-gray-600">
                If the Company is involved in a merger, acquisition or asset
                sale, your Personal Data may be transferred. We will provide
                notice before your Personal Data is transferred and becomes
                subject to a different Privacy Policy.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Law Enforcement
              </h3>
              <p className="text-gray-600">
                Under certain circumstances, the Company may be required to
                disclose your Personal Data if required to do so by law or in
                response to valid requests by public authorities (e.g. a court
                or a government agency).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Other Legal Requirements
              </h3>
              <p className="text-gray-600 mb-4">
                The Company may disclose your Personal Data in the good faith
                belief that such action is necessary to:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Comply with a legal obligation</li>
                <li>
                  • Protect and defend the rights or property of the Company
                </li>
                <li>
                  • Prevent or investigate possible wrongdoing in connection
                  with the Service
                </li>
                <li>
                  • Protect the personal safety of Users of the Service or the
                  public
                </li>
                <li>• Protect against legal liability</li>
              </ul>
            </div>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-6 border-b border-gray-100 pb-2">
              Security of Your Personal Data
            </h2>
            <p className="text-gray-600 mb-4">
              The security of your Personal Data is important to us, but
              remember that no method of transmission over the Internet, or
              method of electronic storage is 100% secure. While we strive to
              use commercially acceptable means to protect your Personal Data,
              we cannot guarantee its absolute security.
            </p>
          </section>

          {/* Service Providers */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-6 border-b border-gray-100 pb-2">
              Detailed Information on the Processing of Your Personal Data
            </h2>
            <p className="text-gray-600 mb-6">
              The Service Providers we use may have access to your Personal
              Data. These third-party vendors collect, store, use, process and
              transfer information about your activity on our Service in
              accordance with their Privacy Policies.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-6 border-b border-gray-100 pb-2">
              Children's Privacy
            </h2>
            <p className="text-gray-600 mb-4">
              Our Service does not address anyone under the age of 13. We do not
              knowingly collect personally identifiable information from anyone
              under the age of 13. If you are a parent or guardian and you are
              aware that your child has provided us with Personal Data, please
              contact us. If we become aware that we have collected Personal
              Data from anyone under the age of 13 without verification of
              parental consent, we take steps to remove that information from
              our servers.
            </p>
            <p className="text-gray-600">
              If we need to rely on consent as a legal basis for processing your
              information and your country requires consent from a parent, we
              may require your parent's consent before we collect and use that
              information.
            </p>
          </section>

          {/* Links to Other Websites */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-6 border-b border-gray-100 pb-2">
              Links to Other Websites
            </h2>
            <p className="text-gray-600 mb-4">
              Our Service may contain links to other websites that are not
              operated by us. If you click on a third party link, you will be
              directed to that third party's site. We strongly advise you to
              review the Privacy Policy of every site you visit.
            </p>
            <p className="text-gray-600">
              We have no control over and assume no responsibility for the
              content, privacy policies or practices of any third party sites or
              services.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-6 border-b border-gray-100 pb-2">
              Changes to this Privacy Policy
            </h2>
            <p className="text-gray-600 mb-4">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
            </p>
            <p className="text-gray-600 mb-4">
              We will let you know via email and/or a prominent notice on our
              Service, prior to the change becoming effective and update the
              "Last updated" date at the top of this Privacy Policy.
            </p>
            <p className="text-gray-600">
              You are advised to review this Privacy Policy periodically for any
              changes. Changes to this Privacy Policy are effective when they
              are posted on this page.
            </p>
          </section>

          {/* Data Protection Rights */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-6 border-b border-gray-100 pb-2">
              Your Data Protection Rights
            </h2>
            <p className="text-gray-600 mb-4">
              Depending on your location, you may have the following rights
              regarding your Personal Data:
            </p>
            <ul className="text-gray-600 space-y-3">
              <li>
                • <strong>The right to access</strong> - You have the right to
                request copies of your personal data.
              </li>
              <li>
                • <strong>The right to rectification</strong> - You have the
                right to request that we correct any information you believe is
                inaccurate or complete information you believe is incomplete.
              </li>
              <li>
                • <strong>The right to erasure</strong> - You have the right to
                request that we erase your personal data, under certain
                conditions.
              </li>
              <li>
                • <strong>The right to restrict processing</strong> - You have
                the right to request that we restrict the processing of your
                personal data, under certain conditions.
              </li>
              <li>
                • <strong>The right to object to processing</strong> - You have
                the right to object to our processing of your personal data,
                under certain conditions.
              </li>
              <li>
                • <strong>The right to data portability</strong> - You have the
                right to request that we transfer the data that we have
                collected to another organization, or directly to you, under
                certain conditions.
              </li>
            </ul>
            <p className="text-gray-600 mt-4">
              If you make a request, we have one month to respond to you. If you
              would like to exercise any of these rights, please contact us
              using the information provided below.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-6 border-b border-gray-100 pb-2">
              Contact Us
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, you can
              contact us:
            </p>
            <div className="text-gray-600 space-y-2">
              <p>
                By sending us an email:{" "}
                <a href="mailto:info@onbored.io" className="underline">
                  info@onbored.io
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
