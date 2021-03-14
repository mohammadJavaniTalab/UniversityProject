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
              ACCNET ONLINE INC. & ACCNET ACCOUNTING NET WORK INC.
            </h1>
            <div>
              <h1 className="m-0 p-0"> TERMS OF SERVICE</h1>
            </div>
            <p className="text-muted">( Last updated: February 24, 2020 )</p>
          </div>
          <div className="text-justify">
            <div>
              These Terms of Service (this <strong>“Agreement”</strong>) set
              forth the terms and conditions that apply to your access and use
              of the internet website(s) located at{" "}
              <a href="https://accnetinc.com/">https://accnetinc.com/</a> or
              <a className="ml-1" href="https://www.accnetonline.com/">
                https://www.accnetonline.com/
              </a>{" "}
              (the <strong>“Site”</strong>), owned and operated by AccNet
              Accounting Network Inc, as well as AccNet Online Inc. (
              <strong>“AccNet”</strong>, <strong>“we”</strong>,{" "}
              <strong>“our”</strong> or <strong>“us”</strong>), and the document
              upload and retrieval services regarding personal tax returns
              available thereon (the <strong>“Services”</strong>).
            </div>
          </div>
          <div className="p-3">
            <div className="text-justify p-3">
              <span>
                BY ACCESSING OR USING THE SITE OR SERVICES YOU ARE INDICATING
                YOUR ACCEPTANCE TO BE BOUND BY THIS AGREEMENT. IF YOU DO NOT
                ACCEPT THIS AGREEMENT, YOU MUST NOT ACCESS OR USE THE SITE OR
                THE SERVICES. IF YOU ARE DISSATISFIED WITH THIS AGREEMENT OR ANY
                RULES, POLICIES, GUIDELINES OR PRACTICES APPLICABLE TO THE SITE
                OR SERVICES, YOUR SOLE AND EXCLUSIVE REMEDY IS TO DISCONTINUE
                USE OF THE SITE AND SERVICES.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                IF YOU ARE ENTERING INTO THIS AGREEMENT ON BEHALF OF A COMPANY
                OR OTHER LEGAL ENTITY, YOU REPRESENT THAT YOU HAVE THE AUTHORITY
                TO BIND SUCH ENTITY TO THESE TERMS AND CONDITIONS, IN WHICH CASE
                THE TERMS “YOU” OR “YOUR” WILL REFER TO SUCH ENTITY. IF YOU DO
                NOT HAVE SUCH AUTHORITY, OR IF YOU DO NOT AGREE WITH THESE TERMS
                AND CONDITIONS, YOU MUST NOT ACCEPT THIS AGREEMENT AND MAY NOT
                USE THE SERVICES.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                IN ADDITION, TO THE EXTENT THAT YOU USE PARTICULAR ACCNET
                SERVICES, INCLUDING WITHOUT LIMITATION ACCNET'S ACCOUNTING, TAX
                PREPARATION OR FILING SERVICES, YOU ARE SUBJECT TO THE
                APPLICABLE AGREEMENT THAT YOU ENTER INTO WITH ACCNET THAT
                GOVERNS THE TERMS AND CONDITIONS APPLICABLE TO YOUR USE OF SUCH
                SERVICE (<strong>"SERVICES AGREEMENTS"</strong>) AND ANY POSTED
                GUIDELINES OR RULES APPLICABLE TO SUCH SERVICES, WHICH MAY BE
                UPDATED OCCASIONALLY. APPLICABLE SERVICES AGREEMENTS ARE
                AVAILABLE AT{" "}
                <a href="https://accnetonline.com/terms-of-service/">
                  https://accnetonline.com/terms-of-service/
                </a>
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                By accepting this Agreement, you agree to be bound by the terms
                and conditions of this Agreement, as well as AccNet’s Privacy
                Policy located at{" "}
                <a href="https://accnetonline.com/privacy-policy/">
                  https://accnetonline.com/privacy-policy/
                </a>{" "}
                (the <strong>“Privacy Policy”</strong>), as it may be amended
                from time to time in the future.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                AccNet may update this Agreement or the Privacy Policy at any
                time, without notification to you, and you should review this
                Agreement and the Privacy Policy from time to time by accessing
                the Site. Your continued use of the Site and/or the Services
                will be deemed irrevocable acceptance of any such revisions.
                Before you continue, you should print or save a local copy of
                this Agreement and the Privacy Policy for your records.
              </span>
            </div>
            <span className="d-block h5">
              1. Ability to Enter into this Agreement
            </span>

            <div className="text-justify p-3">
              <span>
                In order to enter into this Agreement, you must have reached the
                legal age of majority in your jurisdiction of residence, and be
                fully able and competent to enter into the terms, conditions,
                obligations, affirmations, representations and warranties set
                forth in this Agreement, and to abide by and comply with this
                Agreement. It is your responsibility to ensure that you are
                legally eligible to enter into this Agreement under any laws
                applicable to you. If you accept this Agreement, you represent
                that you have the capacity to be bound by it.
              </span>
            </div>
            <span className="d-block h5">2. Intellectual Property Rights</span>
            <div className="text-justify p-3">
              <span>
                2.1 All material available on the Site and all material and
                services provided by or through AccNet, its affiliates,
                subsidiaries, employees, agents, licensors or other commercial
                partners including, but not limited to, software, all
                informational text, software documentation, design of and “look
                and feel”, layout, photographs, graphics, audio, video,
                messages, interactive and instant messaging, design and
                functions, files, documents, images, or other materials, whether
                publicly posted or privately transmitted as well as all
                derivative works thereof (collectively, the{" "}
                <strong>“Materials”</strong>), are owned by us or our licensors
                or service providers, and are protected by copyright, trademark,
                trade secret and other intellectual property laws.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                2.2 Subject to your compliance with all of the terms and
                conditions of this Agreement, during the term of this Agreement,
                AccNet grants to you a non-transferable, non-sublicensable,
                non-exclusive, revocable, limited-purpose right to access and
                use the Materials that we make available to you. You are not
                permitted to download, copy or otherwise store any Materials.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                2.3 If AccNet, in its sole discretion and without notice,
                considers that there is an immediate security or operational
                risk to the Services or any of its, your or a third party
                system, then AccNet may immediately suspend access to or use of
                the Services. The suspension of use and access is not a breach
                of this Agreement. You acknowledge that the preservation of
                security, confidentiality and data is paramount. AccNet has no
                liability to you for suspending the Services under this
                provision.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                2.4 This section does not apply to Content (as defined below);
                however you agree that any ideas, suggestions, testimonials,
                concepts, processes or techniques which you provide to AccNet
                related to the Services, the Site or AccNet or its business (
                <strong>“Feedback”</strong>) are and will be AccNet’s exclusive
                property without any compensation or other consideration payable
                to you by AccNet, and you do so of your own free will and
                volition. AccNet may or may not, in its sole discretion, use or
                incorporate the Feedback in whatever form or derivative AccNet
                may decide into the Site, the Services, its software,
                documentation, business or other products or services, or any
                future versions or derivatives of the foregoing. You hereby
                assign all rights on a worldwide basis in perpetuity to AccNet
                in any Feedback and, as applicable, waive any moral rights.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                2.5 For the purposes of this Agreement and the Privacy Policy,
                <strong>“personal information”</strong> is any information about
                an identifiable individual, as defined in our Privacy Policy.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                2.6 AccNet retains the right to use or share any Aggregated Data
                generated by anyone using the Site or the Services, including
                our users, for the purpose of enhancing and providing the
                Services. <strong>“Aggregated Data”</strong> means data that
                does not contain personal information and which has been
                manipulated or combined to provide generalized, anonymous
                information. Where you choose to utilize or connect certain
                services from third parties with the Services, you agree that
                AccNet may share your lead data with such designated third
                parties. You are still responsible for any and all personal
                information that is part of any Content.
              </span>
            </div>

            <span className="d-block h5">
              3. Your Profile Information and Account
            </span>
            <div className="text-justify p-3">
              <span>
                3.1 To access and use the Site and Services in accordance with
                this Agreement, you must sign up for a AccNet account
                (“Account”). To sign up for an Account, you must provide a valid
                user name and password that complies with AccNet’s technical
                requirements (together, the “User ID”). You agree and understand
                that you are responsible for maintaining the confidentiality of
                your User ID. That User ID, together with any or other user
                information you provide, will form your “Profile Information”
                and allow you to access your Account. You will provide true,
                accurate, current and complete information about yourself, and
                you agree not to misrepresent your Profile Information. You
                represent and warrant to AccNet that you have not misrepresented
                any Profile Information. You are responsible for any Profile
                Information that may be lost or unrecoverable through the use of
                the Site or Services.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                3.2 Your right to access and use the Services is personal to you
                and is not transferable by you to any other person or entity.
                You agree not to disclose your User ID to any third party. You
                are solely responsible for all activities that occur under your
                Account or under your Profile Information. If you become aware
                of any unauthorized use of your Account or Profile Information,
                you are responsible for notifying AccNet immediately. It is your
                responsibility to update or change your Account or Profile
                Information, as appropriate.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                3.3 In the case of any newsletter or other marketing
                initiatives, you can withdraw your consent to receiving those
                communications and unsubscribe to any AccNet subscriptions at
                any time by clicking “Unsubscribe” at the bottom of such
                communication or by contacting info@accnetinc.com. Doing so may
                have a material impact on our ability to provide any Services to
                you, and we are not responsible if you do so.
              </span>
            </div>
            <span className="d-block h5">4. Submission of Content</span>
            <div className="text-justify p-3">
              <span>
                4.1 The Site and the Services available thereon enable you to
                provide or upload content, including but not limited to
                messages, materials, data, text, music, sound, photos, videos,
                graphics, applications, code and other information or content
                (collectively, “Content”), to AccNet for the purpose of
                providing the Services. You acknowledge and agree that you are
                solely responsible for all Content you submit, provide or upload
                and the consequences for submitting, providing or uploading it.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                4.2 AccNet will use Content you upload solely in connection with
                providing the Services to you, and for no other reason. You
                agree that by uploading, or otherwise providing any Content on
                or through the Site and/or the Services, you grant to AccNet a
                perpetual, worldwide, non-exclusive, royalty-free license to
                use, reproduce, process, display, all or any portion of such
                Content, solely in connection with providing the Services to
                you. This license includes the right to host, index, cache or
                otherwise format your Content in order to provide the Services.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                4.3 You represent and warrant that you own your Content or have
                the necessary licenses, rights, consents and permissions to
                grant the license set forth herein and that its provision to
                AccNet or AccNet’s use thereof will not violate the copyrights,
                privacy rights, publicity rights, trademark rights, contract
                rights or any other intellectual property rights or other rights
                of any person or entity.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                4.4 You agree that AccNet is not responsible for any violations
                of any third party intellectual property rights in any Content
                that you submit to AccNet. You agree to pay all royalties, fees
                and any other monies owing to any person by reason of the
                Content uploaded, displayed or otherwise provided by you to the
                Site.
              </span>
            </div>

            <span className="d-block h5">5. Monitoring</span>
            <div className="text-justify p-3">
              <span>
                AccNet may, but has no obligation to, monitor Content on the
                Site, or any website created using our Services. You consent to
                such monitoring. We may disclose any information necessary or
                appropriate to satisfy our legal obligations, protect AccNet or
                its customers, or operate the Site or Services properly, or
                improve the Site or Services. AccNet, in its sole discretion,
                may refuse to post, remove, or require you to remove, any
                Content, in whole or in part, alleged to be unacceptable,
                undesirable, inappropriate, or in violation of this Agreement,
                including, but not limited to the Privacy Policy.
              </span>
            </div>
            <span className="d-block h5">6. Acceptable Use and Conduct:</span>
            <div className="text-justify p-3">
              <span>
                You agree that you will not publish or make available any
                Content that, or use the Site or Services in a manner that:
              </span>
              <div className="text-justify p-3">
                <span>
                  (a) infringes, violates or misappropriates any third party’s
                  intellectual property or proprietary rights; (a) contains
                  software viruses, Trojan horses or any other computer code,
                  files or programs designed to interrupt, destroy or limit the
                  functionality of any computer software or hardware or
                  telecommunications equipment;
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (b) is misleading, deceptive or fraudulent or otherwise
                  illegal or promotes illegal activities, including engaging in
                  phishing or otherwise obtaining financial or other personal
                  information in a misleading manner or for fraudulent or
                  misleading purposes;
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (c) is libelous or defamatory, or that is otherwise
                  threatening, abusive, violent, harassing, malicious or harmful
                  to any person or entity, or is invasive of another’s privacy;
                </span>
              </div>
              <div className="text-justify p-3">
                <span>(d) is harmful to minors in any way;</span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (e) is hateful or discriminatory based on race, color, sex,
                  religion, nationality, ethnic or national origin, marital
                  status, disability, sexual orientation or age or is otherwise
                  objectionable, as reasonably determined by AccNet;
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (f) impersonates a AccNet employee, or any other person, or
                  falsely states or otherwise misrepresents your affiliation
                  with any person or entity, or to obtain access to the Site or
                  Services or a portion thereof without proper authorization;
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (g) interferes or attempts to interfere with the proper
                  working of the Site or Services or prevents others from using
                  the Site or Services, or in a manner that disrupts the normal
                  flow of dialogue with an excessive number of messages
                  (flooding attack) to the Site, or that otherwise negatively
                  affects other persons’ ability to use the Site or Services;
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (h) uses any manual or automated means, including agents,
                  robots, scripts, or spiders, to monitor or copy the Site or
                  Services or the content contained therein;
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (i) facilitates the unlawful distribution of copyrighted
                  Content;
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (j) except as expressly permitted by AccNet, licenses,
                  sublicenses, rents or leases the Services to third parties, or
                  uses the Services for third party training, commercial
                  time-sharing or service bureau use;
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (k) includes personal or identifying information about another
                  person in a manner that employs misleading email or IP
                  addresses, or forged headers or otherwise manipulated
                  identifiers in order to disguise the origin of Content
                  transmitted through the Site or Services to users;
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (l) constitutes or contains any form of advertising or
                  solicitation to users who have requested not to be contacted
                  about other services, products or commercial interests;{" "}
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (m) stalks or otherwise harasses anyone on the Site or using
                  the Services or with information obtained from the Site or
                  Services;{" "}
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (n) collects, uses or discloses data, including personal
                  information, about users without their informed consent or for
                  unlawful purposes or in violation of applicable law or
                  regulations;
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (o) requests, solicits or otherwise obtains access to
                  usernames, passwords or other authentication credentials from
                  any user of the Site or Services for the purposes of
                  automating logins to the Site;
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (p) attempts to gain unauthorized access to the computer
                  systems of AccNet or engage in any activity that disrupts,
                  diminishes the quality of, interferes with the performance of,
                  or impairs the functionality of the Site or Services;{" "}
                </span>
              </div>
              <div className="text-justify p-3">
                <span>(q) posts adult or pornographic Content;</span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (r) decompiles or reverse engineers or attempts to access the
                  source code of the software underlying the Site, the Services
                  or any other AccNet technology;
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (s) copies, archives, stores, reproduces, rearranges,
                  modifies, downloads, uploads, creates derivate works from,
                  displays, performs, publishes, distributes, redistributes or
                  disseminates all or any part of the Site or Services;
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (t) accesses the Site or Services for the purposes of building
                  a product using similar ideas, features, functions, interface
                  or graphics as those found in the Site or Services;{" "}
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (u) accesses the Site or Services for the purposes of
                  monitoring its availability, performance or functionality, or
                  for any other benchmarking or competitive purposes; or
                </span>
              </div>
              <div className="text-justify p-3">
                <span>
                  (v) accesses the Site to upload any Content or computer code
                  for the purposes of: (i) causing a breach or override of
                  security to the Site or Services; (ii) interfering with the
                  proper working, functionality or performance of the Site or
                  Services; or (iii) preventing others from accessing or using
                  the Site or Services.
                </span>
              </div>
            </div>
            <span className="d-block h5">7. Disclaimer of Warranties </span>
            <div className="text-justify p-3">
              <span>
                7.1 YOUR USE OF THE SITE OR SERVICES AND ALL CONTENT FORMING
                PART OF OR RELATED TO THE SITE OR SERVICES, INCLUDING ANY
                CONTENT YOU UPLOAD OR SUBMIT AND ANY THIRD PARTY SOFTWARE AND
                CONTENT, ARE AT YOUR SOLE RESPONSIBILITY AND RISK. THE SITE AND
                SERVICES ARE PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS.
                ACCNET EXPRESSLY DISCLAIMS ALL REPRESENTATIONS, WARRANTIES, OR
                CONDITIONS OF ANY KIND WITH RESPECT TO THE SITE OR SERVICES,
                WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY
                IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR
                A PARTICULAR PURPOSE, ACCURACY, COMPLETENESS, PERFORMANCE,
                SYSTEM INTEGRATION, QUIET ENJOYMENT, TITLE AND NON-INFRINGEMENT.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                7.2 ACCNET DISCLAIMS ANY WARRANTY THAT THE SITE, THE SERVICES OR
                ANY CONTENT, INCLUDING WITHOUT LIMITATION ANY THIRD PARTY
                SOFTWARE AND CONTENT, WILL MEET YOUR REQUIREMENTS OR BE
                UNINTERRUPTED, TIMELY, SECURE OR ERROR-FREE, THAT DEFECTS WILL
                BE CORRECTED, OR THAT THE SITE OR THE SERVERS THAT MAKES THE
                SITE AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
                YOU AGREE THAT FROM TIME TO TIME ACCNET MAY REMOVE THE SITE OR
                CEASE PROVIDING THE SERVICES FOR INDEFINITE PERIODS OF TIME
                WITHOUT NOTICE TO YOU. YOUR ACCESS AND USE OF THE SITE AND THE
                SERVICES MAY BE INTERRUPTED FROM TIME TO TIME FOR ANY OF SEVERAL
                REASONS, INCLUDING, WITHOUT LIMITATION, THE MALFUNCTION OF
                EQUIPMENT, PERIODIC UPDATING, MAINTENANCE OR REPAIR OF THE SITE
                OR SERVICES OR OTHER ACTIONS THAT ACCNET, IN ITS SOLE
                DISCRETION, MAY ELECT TO TAKE. ACCNET MAKES NO GUARANTEE
                REGARDING THE COMPATIBILITY OF ANY SOFTWARE, HARDWARE OR CONTENT
                WITH THE SITE OR SERVICES.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                7.3 ACCNET IS NOT RESPONSIBLE FOR THE ACTS OR OMISSIONS OF, OR
                FOR THE FAILINGS OF, ANY THIRD-PARTY PROVIDER OF ANY CONTENT,
                SERVICE, NETWORK, SOFTWARE OR HARDWARE, INCLUDING BUT NOT
                LIMITED TO, INTERNET SERVICE PROVIDERS, HOSTING SERVICES
                UTILIZED BY ACCNET, TELECOMMUNICATIONS PROVIDERS, CONTENT
                PROVIDED BY OTHER USERS, OR ANY SOFTWARE OR HARDWARE NOT
                PROVIDED BY ACCNET.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                7.4 YOU ARE SOLELY RESPONSIBLE FOR ENSURING THAT YOUR CONTENT IS
                COMPATIBLE WITH THE SITE AND SERVICES. ACCNET DISCLAIMS ANY
                LIABILITY OR RESPONSIBILITY FOR ANY UNAUTHORIZED USE OF YOUR
                CONTENT BY THIRD PARTIES OR OTHER USERS OF THE SITE AND SERVICES
                AND IS NOT RESPONSIBLE FOR PROTECTING YOUR CONTENT.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                7.5 ANY MATERIAL DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE
                USE OF THE SITE OR SERVICES IS DONE AT YOUR OWN DISCRETION AND
                RISK AND YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR
                COMPUTER SYSTEM OR OTHER DEVICE OR LOSS OF DATA THAT RESULTS
                FROM THE DOWNLOAD OF ANY SUCH MATERIAL.{" "}
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                7.6 NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED
                BY YOU FROM ACCNET OR THROUGH OR FROM THE SITE OR SERVICES WILL
                CREATE ANY WARRANTY NOT EXPRESSLY STATED IN THIS AGREEMENT.{" "}
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                7.7 THE SITE AND SERVICES ARE OFFERED AND CONTROLLED BY ACCNET
                FROM ITS FACILITIES IN CANADA. ACCNET MAKES NO REPRESENTATIONS
                THAT THE SITE OR SERVICES ARE APPROPRIATE OR AVAILABLE FOR USE
                IN OTHER LOCATIONS. THOSE WHO ACCESS OR USE THE SITE OR SERVICES
                FROM OTHER JURISDICTIONS DO SO AT THEIR OWN VOLITION AND ARE
                RESPONSIBLE FOR COMPLIANCE WITH LOCAL LAW.
              </span>
            </div>

            <span className="d-block h5">
              8. Third Party Sites and Content{" "}
            </span>
            <div className="text-justify p-3">
              <span>
                The Site may permit you to link to other websites or resources
                on the Internet, and other websites or resources may contain
                links to the Site. These other websites are not under AccNet’s
                control, and you acknowledge that AccNet is not responsible or
                liable for any third party content, including but not limited to
                the accuracy, integrity, quality, usefulness, legality,
                appropriateness, safety or intellectual property rights of or
                relating to such third party content or any other aspect of such
                websites or resources. The inclusion of any such link does not
                imply endorsement by AccNet or any association with its
                operators. You further acknowledge and agree that AccNet will
                not be responsible or liable, directly or indirectly, for any
                damage or loss caused or alleged to be caused by or in
                connection with the use of or reliance on any such third party
                content, goods or services available on or through any such
                website or resource. Access and use of third party sites,
                including the information, material, products and services on
                third party sites or available through third party sites, is
                solely at your own risk.
              </span>
            </div>
            <span className="d-block h5">
              9. Exclusive Remedy and Limitation of Liability{" "}
            </span>
            <div className="text-justify p-3">
              <span>
                9.1 YOU AGREE THAT, UNDER NO LEGAL THEORY, INCLUDING, BUT NOT
                LIMITED TO NEGLIGENCE, BREACH OF WARRANTY OR CONDITION, BREACH
                OF CONTRACT OR TORT, WILL ACCNET OR ITS OWNERS, OFFICERS,
                DIRECTORS, AFFILIATES, CONTRACTORS, EMPLOYEES OR AGENTS, BE
                LIABLE TO YOU OR ANY THIRD PARTY ACTING ON YOUR BEHALF FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR
                EXEMPLARY DAMAGES OR DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE,
                DATA, OR OTHER INTANGIBLE LOSSES OR THE COST OF ANY SUBSTITUTE
                EQUIPMENT, FACILITIES OR SERVICES (EVEN IF ACCNET HAS BEEN
                ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), ARISING FROM OR
                RELATING TO THIS AGREEMENT OR YOUR USE OF OR YOUR INABILITY TO
                USE THE SITE OR SERVICES, OR FOR ANY DAMAGES ARISING FROM OR
                RELATED TO THIS AGREEMENT. ACCNET’S TOTAL AGGREGATE LIABILITY
                FROM ANY AND ALL CLAIMS UNDER THIS AGREEMENT IS LIMITED TO THE
                TOTAL AMOUNTS YOU PAID TO ACCNET IN THE ONE (1) YEAR IMMEDIATELY
                PRECEDING THE OCCURRENCE OF LOSS OR DAMAGE. TO THE EXTENT ANY
                PROVINCE, STATE OR JURISDICTION DOES NOT ALLOW THE EXCLUSION OR
                THE LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL
                DAMAGES, ACCNET’S LIABILITY IN SUCH PROVINCE, STATE OR
                JURISDICTION WILL BE LIMITED TO THE FURTHEST EXTENT PERMITTED BY
                LAW. NOTWITHSTANDING THE FOREGOING OR ANYTHING ELSE HEREIN TO
                THE CONTRARY, ACCNET WILL NOT BE LIABLE TO YOU OR ANY THIRD
                PARTY ACTING ON YOUR BEHALF IN ANY WAY WITH RESPECT TO YOUR
                PROVISION OF AN INDIVIDUAL’S PERSONAL INFORMATION TO ACCNET OR
                THROUGH THE SERVICES. YOU FURTHER AGREE THAT THE FOREGOING
                LIMITATIONS WILL APPLY WITH RESPECT TO THIRD PARTY LIABILITY OF
                ANY KIND.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                9.2 THE FOREGOING LIMITATIONS WILL ALSO APPLY WITH RESPECT TO
                ANY DAMAGES INCURRED BY REASON OF ANY CONTENT OR SERVICES
                PROVIDED ON ANY THIRD PARTY SITES OR OTHERWISE PROVIDED BY ANY
                THIRD PARTIES OTHER THAN ACCNET AND RECEIVED BY YOU THROUGH OR
                ADVERTISED ON THE SITE OR RECEIVED BY YOU ON ANY THIRD PARTY
                SITES. YOU ALSO AGREE THAT ACCNET WILL NOT BE RESPONSIBLE OR
                LIABLE FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS THE RESULT
                OF ANY INTERACTIONS OR DEALINGS WITH ADVERTISERS OR AS THE
                RESULT OF THE PRESENCE OF SUCH ADVERTISERS ON THE SITE.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                9.3 AccNet will have no liability whatsoever for any damages,
                liabilities, losses or any other consequences that you may incur
                as a result of any modification, suspension or discontinuance of
                the Site and/or the Services.
              </span>
            </div>
            <span className="d-block h5">
              10. Waiver of Jury Trial and Class Action Rights
            </span>
            <div className="text-justify p-3">
              <span>
                WITH RESPECT TO ANY DISPUTE ARISING OUT OF OR RELATED TO THE
                SITE, THE SERVICES AND/OR THIS AGREEMENT: (A) YOU HEREBY
                EXPRESSLY GIVE UP YOUR RIGHT TO HAVE A TRIAL BY JURY; AND (B)
                YOU HEREBY EXPRESSLY GIVE UP YOUR RIGHT TO PARTICIPATE AS A
                MEMBER OF A CLASS OF CLAIMANTS, IN ANY LAWSUIT INCLUDING BUT NOT
                LIMITED TO CLASS ACTION LAWSUITS INVOLVING ANY SUCH DISPUTE.
              </span>
            </div>
            <span className="d-block h5">11. Limitation of Time</span>
            <div className="text-justify p-3">
              <span>
                You agree that you will not bring a claim under or related to
                this Agreement more than 12 months from when your claim first
                arose.
              </span>
            </div>
            <span className="d-block h5">12. Indemnity</span>
            <div className="text-justify p-3">
              <span>
                You agree to indemnify, defend and hold harmless AccNet, and its
                subsidiaries, affiliates, co-branders, all third-party
                advertisers, technology providers, service providers or other
                partners, and each of their respective officers, directors,
                agents, shareholders, employees and representatives (together,
                the “Indemnified Parties”), from and against any third party
                claim, demand, loss, damage, cost, or liability (including,
                reasonable attorneys’ fees) (collectively and individually,
                “Claims”) incurred by or made against the Indemnified Parties in
                connection with any Claims arising out of or relating to this
                Agreement, the Site or the Services, including but without
                limitation in relation to: (a) your use, non-use or misuse of,
                or connection to the Site, the Services and any Content,
                including without limitation your Profile Information and any
                third party Content forming part of the Site; (b) your violation
                or alleged violation of this Agreement; and (c) your violation
                of any rights, including intellectual property rights, of a
                third party and otherwise as set out herein. AccNet reserves the
                right, at your expense, to assume the exclusive defense and
                control of any matter for which you are required to indemnify
                AccNet and you agree to cooperate with AccNet’s defense of these
                Claims. You agree not to settle any matter without the prior
                written consent of AccNet. AccNet will use reasonable efforts to
                notify you of any such Claims upon becoming aware of it.
              </span>
            </div>
            <span className="d-block h5">13. Cancellation and Termination</span>
            <div className="text-justify p-3">
              <span>
                13.1 You may cancel your Account at any time through the web
                interface provided as part of the Services. This is the only way
                to cancel your Account. Phone requests to cancel your Account
                will not be accepted.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                13.2 AccNet is under no obligation to store your Content and may
                delete your Account and your Content immediately upon
                cancellation or may keep your Account and your Content for up to
                7 days following the last day of the month of cancellation.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                13.3 AccNet reserves the right at any time, and without cost,
                charge or liability, to terminate this Agreement at its sole
                discretion for any reason, including, but not limited to, a
                failure to comply with the terms of this Agreement. AccNet
                reserves the right to modify, suspend or discontinue the Site
                and/or Services, or any portion thereof, at any time and for any
                reason, with or without notice.
              </span>
            </div>
            <span className="d-block h5">14. Miscellaneous </span>
            <div className="text-justify p-3">
              <span>
                14.1 This Agreement has been made in and shall be construed and
                enforced in accordance with the laws of the jurisdiction of the
                Province of British Columbia and the federal laws of Canada,
                without regard to conflict of laws principles, and you
                irrevocably consent to submit to the exclusive jurisdiction of
                the courts of the Province of British Columbia for any claim,
                proceeding or action under this Agreement against AccNet.
                Notwithstanding the foregoing, AccNet may seek and obtain
                injunctive relief in any jurisdiction in any court of competent
                jurisdiction and you agree that this Agreement is specifically
                enforceable by AccNet through injunctive relief and other
                equitable remedies without proof of monetary damages.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                14.2 If any portion of this Agreement is deemed unlawful, void
                or unenforceable by any arbitrator or court of competent
                jurisdiction, this Agreement as a whole will not be deemed
                unlawful, void or unenforceable, but only that portion of this
                Agreement that is unlawful, void or unenforceable will be
                stricken from this Agreement.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                14.3 You agree that if AccNet does not exercise or enforce any
                legal right or remedy which is contained in the Agreement (or
                which AccNet has the benefit of under any applicable law), this
                will not be taken to be a formal waiver of AccNet’s rights and
                that those rights or remedies will still be available to AccNet.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                14.4 The following sections will survive any actual or purported
                termination or expiry of this Agreement and continue in full
                force and effect: Sections 2, 4, 7 through 12 and 14.
              </span>
            </div>
            <div className="text-justify p-3">
              <span>
                14.5 This Agreement, along with any applicable Services
                Agreement, is the entire agreement between us related to the
                subject matter in this Agreement. This Agreement replaces and
                supersedes any other prior or contemporaneous agreement,
                representation or discussion, oral or written, and may not be
                changed except in writing signed by us, regardless of whether or
                not the parties act under an unsigned “electronic” agreement or
                rely on such an unsigned agreement.
              </span>
            </div>
            <span className="d-block h5">15. Contacting AccNet </span>
            <div className="text-justify p-3">
              <span>
                You may contact AccNet by email at info@accnetinc.com.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default index;
