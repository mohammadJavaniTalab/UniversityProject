import React, { Component, Fragment } from "react";
import AllImages from "../../assets/images/images";

import "./styles.scss";
import { Link } from "gatsby";
import { pathProject } from "../../service/constants/defaultValues";

class index extends Component {
  render() {
    return (
      <div className="terms-of-service">
        <div
          style={{ backgroundImage: `url(${AllImages.background.motors})` }}
          className="top_announcement"
        />
        <nav className="uk-background-primary">
          <div className="container height-50">
            <div className="uk-navbar">
              <div className="uk-navbar-left">
                <img src={AllImages.logo} alt="logo" className="logo" />
              </div>
              <div className="uk-navbar-right">
                <ul className="uk-navbar-nav">
                  <li className="px-2">
                    <Link className="text-color" to={pathProject.login}>
                      login
                    </Link>
                  </li>
                  <li className="px-2">
                    <Link className="text-color" to={pathProject.register}>
                      register
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        <div className="container mt-5">
          <div className="text-center">
            <h1 className="m-0 p-0">
              ACCNET ACCOUNTING NETWORK INC. & ACCNET ONLINE INC.
            </h1>
            <div>
              <h1 className="m-0 p-0">
              PRIVACY POLICIES
              </h1>
            </div>
            <p className="text-muted">( Last Updated: February 24, 2020 )</p>
          </div>
          <div className="text-justify">
            <p>
              AccNet Accounting Networks Inc. & AccNet Online Inc. (“AccNet”,
              “we” or “us”) is committed to protecting your privacy and
              safeguarding your personal information. The purpose of this
              privacy policy is to inform you about our privacy practices,
              including how we collect, use and disclose your personal
              information. This privacy policy relates to all of our activities,
              unless we have provided you with a separate privacy policy for a
              particular product, service or activity. Please review this
              privacy policy carefully. By submitting your personal information
              to us, by registering for or using any of the services we offer,
              by using our website, including without limitation accessing or
              using our document upload and retrieval services regarding
              personal tax returns, or by voluntarily interacting with us, you
              consent to our collecting, using and disclosing your personal
              information as set out in this privacy policy, as revised from
              time to time.
            </p>
          </div>
          <div className="p-3">
            <span className="d-block h5">WHAT’S IN THIS PRIVACY POLICY?</span>
            <div className="text-justify p-3">
              <span>
                Meaning of Personal Information Your Consent to Collection, Use
                and Disclosure Personal Information We Collect How We Use Your
                Personal Information How We Share Your Personal Information
                Opting Out of Communications Retention of Personal Information
                Information Security Accessing and Updating Your Personal
                Information International Transfer and Storage of Information
                Third Party Websites and Services Children’s Information Privacy
                policy Updates Contact Us.
              </span>
            </div>
            <span className="d-block h5">Meaning of Personal Information</span>
            <div className="text-justify p-3">
              <span>
                <strong>“Personal information”</strong> means information about
                an identifiable individual. This information may include, but is
                not limited to, your name, mailing address, residential address,
                e-mail address, telephone number, marital status, date of birth,
                and social insurance number. Personal information does not
                include any business contact information that is solely used to
                communicate with you in relation to your employment, business or
                profession, such as your name, position name or title, work
                address, work telephone number, work fax number or work
                electronic address. Personal information also does not include
                information that has been anonymized or aggregated in such a way
                that there is no serious possibility it can be used to identify
                an individual, whether on its own or in combination with other
                information.
              </span>
            </div>
            <span className="d-block h5">
              Your Consent to Collection, Use and Disclosure
            </span>
            <div className="text-justify p-3">
              <span>
                We collect, use and disclose your personal information with your
                consent or as permitted or required by law. How we obtain your
                consent (i.e. the form we use) will depend on the circumstances,
                as well as the sensitivity of the information collected. Subject
                to applicable laws, your consent may be express or implied,
                depending on the circumstances and the sensitivity of the
                personal information in question. If you choose to provide
                personal information to us, we assume that you consent to the
                collection, use and disclosure of your personal information as
                outlined in this privacy policy. Typically, we will seek your
                consent at the time your personal information is collected.
                Where we want to use your personal information for a purpose not
                previously identified to you at the time of collection, we will
                seek your consent prior to our use of such information for this
                new purpose. You may withdraw your consent to our collection,
                use or disclosure of your personal information at any time by
                contacting us using the contact information in the “Contact Us”
                section below. However, before we implement the withdrawal of
                consent, we may require proof of your identity. In some cases,
                withdrawal of your consent may mean that we will no longer be
                able to provide certain products or services. If you provide
                personal information about another individual to us, it is your
                responsibility to obtain the consent of that individual to
                enable us to collect, use and disclose his or her information as
                described in this privacy policy.
              </span>
            </div>
            <span className="d-block h5">Personal Information We Collect</span>
            <div className="text-justify p-3">
              <span className="d-block">
                The personal information we collect is generally in one or more
                of the following categories.
              </span>
              <ul>
                <li>
                  <div style={{ marginLeft: "5rem", marginTop: "1rem" }}>
                    <span
                      style={{
                        textDecoration: "underline",
                        marginRight: "15px",
                      }}
                    >
                      {" "}
                      Products and Services.{" "}
                    </span>{" "}
                    For individuals who use our products and services, we may
                    collect information from you or from your use of our
                    products or services.
                  </div>
                  <div style={{ display: "list-item", listStyleType: "disk" }}>
                    <div style={{ marginLeft: "10rem", marginTop: "1rem" }}>
                      Information you submit to us: we collect information that
                      you submit through your use of our products or services,
                      including information you provide in connection with the
                      creation and management of your account for our products
                      or services, such as your name, date of birth, e-mail
                      address and other contact information and password. If you
                      wish for us to file your taxes electronically, we will
                      need your social insurance number. This is required by the
                      Canadian Revenue Agency in order to successfully file your
                      tax returns. Please see “Retention of Personal
                      Information” section below for details with respect to how
                      we store your social insurance number.
                    </div>
                    <div style={{ marginLeft: "10rem", marginTop: "1rem" }}>
                      Information we automatically collect: we collect log data
                      and usage information relating to your use of our products
                      and services.
                    </div>
                  </div>
                </li>
                <li>
                  <ul>
                    <div style={{ marginLeft: "5rem", marginTop: "1rem" }}>
                      <span
                        style={{
                          textDecoration: "underline",
                          marginRight: "15px",
                        }}
                      >
                        {" "}
                        Website.{" "}
                      </span>{" "}
                      For individuals who visit our website located at
                      https://accnetinc.com/ or any of our related websites
                      (collectively, our “website”), we may collect information
                      from you or from your activities on the site.
                    </div>
                    <div style={{ marginLeft: "10rem", marginTop: "1rem" }}>
                      Like most websites and other Internet services, we may
                      collect certain technical and device information about
                      your use of our website. Such information may include your
                      Internet protocol address, information about your device,
                      browser and operating system, and the date and time of
                      your visit.
                    </div>
                    <div style={{ marginLeft: "10rem", marginTop: "1rem" }}>
                      We may also use “cookies” or enlist third party services
                      which use cookies to track your preferences and activities
                      on our website. Cookies are small data files transferred
                      to your computer’s hard-drive by a website. They keep a
                      record of your preferences, making your subsequent visits
                      to the site more efficient. Cookies may store a variety of
                      information, including the number of times that you access
                      a site, your registration information and the number of
                      times that you view a particular page or other item on the
                      site. The use of cookies is a common practice adopted by
                      most major sites to better serve their users. Most
                      browsers are designed to accept cookies, but they can be
                      modified to block cookies. See your browser’s help files
                      for more information. You should note, however, that
                      without cookies some of our website’s functions may not be
                      available.
                    </div>
                  </ul>
                </li>
                <div style={{ marginLeft: "5rem", marginTop: "1rem" }}>
                  <span
                    style={{
                      textDecoration: "underline",
                      marginRight: "15px",
                    }}
                  >
                    {" "}
                    Other Interactions.{" "}
                  </span>{" "}
                  For individuals who otherwise interact with us, whether in
                  person, by phone or email, through social media or otherwise,
                  including individuals who might be interested in acquiring our
                  products or services, who sign-up to receive newsletters or
                  other communications, or who respond to surveys and
                  questionnaires, we may collect information that you provide to
                  us during these interactions. This information may include
                  your name, e-mail address and other contact information.
                </div>
                <div style={{ marginTop: "1rem" }}>
                  We do not collect payment card information. If you make an
                  online payment using a payment card, such as a credit card or
                  debit card, you are connected directly to our online payment
                  processing service provider and your payment card information
                  is collected and processed by that service provider.
                </div>
              </ul>
            </div>
            <span className="d-block h5">
              How We Use Your Personal Information
            </span>
            <div className="text-justify p-3">
              <span>
                We may use your personal information and other information for
                purposes such as:
              </span>
              <ul>
                <div style={{ marginLeft: "5rem", marginTop: "1rem" }}>
                  • to provide you with our products and services and to support
                  your use of our products and services;
                </div>
                <div style={{ marginLeft: "5rem", marginTop: "1rem" }}>
                  • to contact you relating to our products and services;
                </div>
                <div style={{ marginLeft: "5rem", marginTop: "1rem" }}>
                  • to monitor and improve our products and services, and to
                  develop new products and services;
                </div>
                <div style={{ marginLeft: "5rem", marginTop: "1rem" }}>
                  • to analyze the needs and activities of our customers to help
                  us better serve them;
                </div>
                <div style={{ marginLeft: "5rem", marginTop: "1rem" }}>
                  • to conduct research and analysis related to our business,
                  products and services;
                </div>
                <div style={{ marginLeft: "5rem", marginTop: "1rem" }}>
                  • to respond to inquiries and other requests;
                </div>
                <div style={{ marginLeft: "5rem", marginTop: "1rem" }}>
                  • to collect opinions and comments in regard to our products
                  and services;
                </div>
                <div style={{ marginLeft: "5rem", marginTop: "1rem" }}>
                  • to provide you with information that we think may interest
                  you, including in regards to our products and services;{" "}
                </div>
                <div style={{ marginLeft: "5rem", marginTop: "1rem" }}>
                  • if authorized by you, to make filings on your behalf with
                  Canada Revenue Agency and other regulatory agencies solely in
                  connection with the services we provide to you; and to
                  investigate legal claims.
                </div>
              </ul>
            </div>
            <div style={{ marginTop: "" }}>
              We may use your personal information and other information for
              purposes for which we have obtained your consent, and for such
              other purposes as may be permitted or required by applicable law.
            </div>

            <div style={{ marginTop: "1rem" }}>
              We do not use the information we collect to provide advertising of
              third party products and services or targeted advertising of
              AccNet products and services across third party websites or
              service offerings.
            </div>

            <span className="d-block h5 mt-3">
              How We Share Your Personal Information
            </span>
            <div style={{ marginTop: "1rem" }}>
              We rely on third party services providers to perform a variety of
              services on our behalf, such as e-commerce providers, payment card
              processers, telephone and technical support providers, hosting,
              data storage and processing service providers, and research and
              analytics providers.
            </div>

            <div style={{ marginTop: "1rem" }}>
              If we provide your information to service providers, then we
              require that the service providers maintain the confidentiality of
              your personal information and keep your personal information
              secure. We also require that they only use your personal
              information for the limited purposes for which it is provided.
              When our service providers no longer need your personal
              information for those limited purposes, we require that they
              dispose of the personal information. In some circumstances, we may
              permit our service providers to retain aggregated, anonymized or
              statistical information that does not identify you. We do not
              authorize the service providers to disclose your personal
              information to unauthorized parties or to use your personal
              information for their direct marketing purposes. If you would like
              more information about our service providers, please contact us
              using the contact information in the “Contact Us” section below.
            </div>

            <div style={{ marginTop: "1rem" }}>
              Additionally, we may use and disclose your information when we
              believe such use or disclosure is permitted, necessary or
              appropriate: (a) under applicable law, including laws outside your
              country of residence; (b) to comply with legal process; (c) to
              respond to requests from public and government authorities,
              including public and government authorities outside your country
              of residence; (d) to enforce the terms of the agreements for our
              products and services; (e) to protect our operations or those of
              any of our affiliates or subsidiaries; (f) to protect our rights,
              privacy, safety or property, and/or those of our affiliates, you
              or others; and (g) to allow us to pursue available remedies or
              limit the damages that we may sustain. In addition, we may
              transfer your personal information and other information to a
              third party in the event of any reorganization, merger, sale,
              joint venture, assignment, transfer or other disposition of all or
              any portion of our business, brands, affiliates, subsidiaries or
              other assets.
            </div>

            <div style={{ marginTop: "1rem" }}>
              If we otherwise intend to disclose your personal information to a
              third party, we will identify that third party and the purpose for
              the disclosure, and obtain your consent.
            </div>

            <span className="d-block h5 mt-3">
              Opting Out of Communications{" "}
            </span>

            <div style={{ marginTop: "1rem" }}>
              If you no longer want to receive marketing-related emails from us,
              you may opt-out of receiving marketing-related emails by clicking
              the “unsubscribe” link at the bottom of any email you receive from
              us, or, if you created an online account when you registered to
              receive our emails, you may log-in to your account and make
              changes to your communication preferences. You may also opt-out by
              contacting us directly using the contact information in the
              “Contact Us” section below.
            </div>

            <div style={{ marginTop: "1rem" }}>
              We will endeavour to respond to your opt-out request promptly, but
              we ask that you please allow us a reasonable time to process your
              request. Please note that if you opt-out from receiving
              marketing-related emails, we may still need to send you
              communications about your use of our products or services, or
              other matters.
            </div>

            <span className="d-block h5 mt-3">
              Retention of Personal Information{" "}
            </span>

            <div style={{ marginTop: "1rem" }}>
              We will use, disclose or retain your personal information only for
              as long as necessary to fulfill the purposes for which that
              personal information was collected and as permitted or required by
              law. For example, we will store your social insurance number for
              the duration it takes to complete your income tax return, usually
              no longer than 7 days. Once your taxes have been electronically
              filed, we will delete your social insurance number from our
              systems.
            </div>

            <span className="d-block h5 mt-3">Information Security </span>

            <div style={{ marginTop: "1rem" }}>
              We have implemented physical, organizational, contractual and
              technological security measures with a view to protecting your
              personal information and other information from loss or theft,
              unauthorized access, disclosure, copying, use or modification. We
              have taken steps to ensure that the only personnel who are granted
              access to your personal information are those with a business
              ‘need-to-know’ or whose duties reasonably require such
              information.
            </div>

            <div style={{ marginTop: "1rem" }}>
              Despite the measure outlined above, no method of information
              transmission or information storage is 100% secure or error-free,
              so we unfortunately cannot guarantee absolute security. If you
              have reason to believe that your interaction with us is no longer
              secure (for example, if you feel that the security of any
              information that you provided to us has been compromised), please
              contact us immediately using the contact information in the
              “Contact Us” section below.
            </div>

            <span className="d-block h5 mt-3">
              Accessing and Updating Your Personal Information
            </span>

            <div style={{ marginTop: "1rem" }}>
              We will take steps to ensure that your personal information is
              kept as accurate, complete and up-to-date as reasonably necessary.
              We will not routinely update your personal information, unless
              such a process is necessary. We expect you, from time to time, to
              supply us with updates to your personal information, when
              required.
            </div>
            <div style={{ marginTop: "1rem" }}>
              You may make a written request to review any personal information
              about you that we have collected, used or disclosed, and we will
              provide you with any such personal information to the extent
              required by law. You may also challenge the accuracy or
              completeness of your personal information in our records. If you
              successfully demonstrate that your personal information in our
              records is inaccurate or incomplete, we will amend the personal
              information as required.
            </div>
            <div style={{ marginTop: "1rem" }}>
              We may require that you provide sufficient identification to
              fulfill your request to access or correct your personal
              information. Any such identifying information will be used only
              for this purpose.
            </div>

            <span className="d-block h5 mt-3">
              International Transfer and Storage of Information{" "}
            </span>

            <div style={{ marginTop: "1rem" }}>
              Your personal information may be stored and processed in any
              country where we have facilities or in which we engage third party
              service providers. As a result, your personal information may be
              transferred to countries outside your country of residence, which
              may have different data protection rules than in your country.
              While such information is outside of your country, it is subject
              to the laws of the country in which it is located, and may be
              subject to disclosure to the governments, courts or law
              enforcement or regulatory agencies of such other country, pursuant
              to the laws of such country.
            </div>

            <span className="d-block h5 mt-3">
              Third Party Websites and Services
            </span>

            <div style={{ marginTop: "1rem" }}>
              This privacy policy applies only to our products and services.
              This privacy policy does not extend to any websites or products or
              services provided by third parties. We do not assume
              responsibility for the privacy practices of such third parties,
              and we encourage you to review all third party privacy policies
              prior to using third party websites or products or services.
            </div>

            <span className="d-block h5 mt-3">Children’s Information </span>

            <div style={{ marginTop: "1rem" }}>
              Our products and services are not intended for children under the
              age of 18, and we do not knowingly collect personal information
              from children under the age of 18. Children under the age of 18
              should not use our products and services and should not provide us
              with their personal information.
            </div>

            <span className="d-block h5 mt-3">Privacy policy Updates </span>

            <div style={{ marginTop: "1rem" }}>
              This privacy policy is current as of the “updated” date which
              appears at the top of this page. We may modify this privacy policy
              from time to time. When changes are made to this privacy policy
              they will become immediately effective when published in a revised
              privacy policy posted on our website unless otherwise noted. We
              may also communicate the changes through our services or by other
              means. By submitting your personal information to us, by
              registering for or using any of the services we offer, by using
              our website, or by voluntarily interacting with us after we
              publish or communicate a notice about the changes to this privacy
              policy, you consent to our collecting, using and disclosing your
              personal information as set out in the revised privacy policy.
            </div>

            <span className="d-block h5 mt-3">Contact us</span>
            <div>
              <span>
                practices should be sent to our Privacy Officer as follows:
              </span>
              <div className="mt-2">
                Address:{" "}
                <span className="ml-2">
                  Attention: Maryam Ghodousi, Privacy Officer 500 - 224 West
                  Esplanade All comments, questions, concerns or complaints
                  regarding your personal information or our privacy North
                  Vancouver, BC V7M 1A4
                </span>
              </div>
              <div className="mt-2">
                {" "}
                By e-mail: <span className="ml-2">info@accnetinc.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default index;
