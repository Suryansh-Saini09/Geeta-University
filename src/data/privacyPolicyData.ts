export interface PrivacyPolicyHero {
  title: string;
  lastUpdated: string;
  heroImage: string;
  heroImageAlt: string;
  summaryText: string;
}

export interface PrivacyPolicyIntroduction {
  heading: string;
  badge: string;
  p1: string;
  p2: string;
  p3: string;
}

export interface PrivacyPolicyTermsAndCollection {
  heading: string;
  collectionIntro: string;
  personalInfoTitle: string;
  personalInfoText: string;
  nonPersonalInfoTitle: string;
  nonPersonalInfoText: string;
  collectiveDefinition: string;
}

export interface PrivacyPolicyCollectionMethods {
  heading: string;
  methodsIntro: string;
  methodsList: string[];
  socialMediaNote: string;
  autoCollectionHeading: string;
  autoCollectionText: string;
}

export interface PrivacyPolicyHowWeUse {
  heading: string;
  usesIntro: string;
  usesList: string[];
  optOutNotice: string;
}

export interface PrivacyPolicyDisclosureAndRights {
  heading: string;
  disclosureHeading: string;
  disclosureIntro: string;
  disclosureList: string[];
  accessRightsHeading: string;
  accessRightsText: string;
  dataSecurityHeading: string;
  dataSecurityText: string;
}

export interface PrivacyPolicyAdditionalPolicies {
  heading: string;
  childrenHeading: string;
  childrenText: string;
  doNotTrackHeading: string;
  doNotTrackText: string;
  changesHeading: string;
  changesText: string;
  marketingHeading: string;
  marketingText: string;
  contactHeading: string;
  contactDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

export interface PrivacyPolicyLegacyEcosystem {
  heading: string;
  description: string;
  contextText: string;
  items: Array<{ name: string; detail: string; color: string }>;
  footerText: string;
  image: string;
}

export const defaultPrivacyPolicyHero: PrivacyPolicyHero = {
  title: "Privacy Policy",
  lastUpdated: "June 21, 2023",
  heroImage: "/uploads/all/252/conversions/new-building-3-(1)-full.webp",
  heroImageAlt: "Campus view of Geeta University in Panipat",
  summaryText:
    "Learn about Geeta University’s privacy policy, data collection practices, and how we ensure your personal information is protected, confidential, and secure.",
};

export const defaultPrivacyPolicyIntroduction: PrivacyPolicyIntroduction = {
  heading: "Introduction",
  badge: "Overview",
  p1: "Geeta University respects your privacy and is committed to protecting it through our compliance with this policy.",
  p2: "This Privacy Policy (“Policy”) describes the types of information we may collect from you or that you may provide when you use Geeta University Alumni Association’s website, services, and application (collectively “Services”) and our practices for collecting, using, maintaining, protecting, and disclosing that information. This Policy does not apply to information collected by any third party, including through any application or content (including advertising) that may link to or be accessible from or on Geeta University Alumni Association’s Services.",
  p3: "Please read this policy carefully to understand our policies and practices regarding your information and how we will treat it. If you do not agree with our policies and practices, your choice is not to use our Services. By accessing or using Geeta University Alumni Association’s Services, you agree to this Policy. This Policy may change from time to time (see Changes to our Privacy Policy). You will be provided notice of this change, and continuing to use the Services after receiving notice will constitute acceptance of the changes.",
};

export const defaultPrivacyPolicyTermsAndCollection: PrivacyPolicyTermsAndCollection = {
  heading: "Terms & Information We Collect",
  collectionIntro:
    "Geeta University Alumni Association collects several types of information. Such information is utilized in providing an efficient and effective experience to all users. When we provide the Services to you, your data is stored on our computers and servers. In some cases, the data may be accessible to people involved with the operation of the site (administration, sales, marketing, legal, system administration) or external parties (such as third party technical service providers, mail carriers, hosting providers, IT companies, communications agencies) appointed, as necessary, as Data Processors by us. Geeta University Alumni Association collects the following information:",
  personalInfoTitle: "Personal Information",
  personalInfoText:
    "Personal Information, which includes information through which you may be personally identified, such as name, postal addresses, email addresses, IP address, social media website user account names, telephone numbers, companies you may be associated with, education, employment history, or other addresses at which you receive communications from or on behalf of Geeta University Alumni Association (“Personal Information”).",
  nonPersonalInfoTitle: "Non-Personal Information",
  nonPersonalInfoText:
    "Non-Personal Information, which includes information that alone cannot be used to identify or contact you. Such Non-Personal Information may include, but is not limited to; browser information and details; operating system information; mobile device information; pages accessed; times of visit; and referring websites, applications, or services, including the relevant search queries that led you to our Services (“Non-Personal Information”).",
  collectiveDefinition:
    "Collectively, Personal Information and Non-Personal Information shall be referred to as “Information.”",
};

export const defaultPrivacyPolicyCollectionMethods: PrivacyPolicyCollectionMethods = {
  heading: "Method of Collecting Information",
  methodsIntro:
    "Geeta University Alumni Association collects Information in two ways: (1) Information you provide directly; and (2) Information we receive from your use of our Services. Information is collected when you:",
  methodsList: [
    "Send Geeta University Alumni Association any electronic communication (including via email or any other application).",
    "Enter contests run by us from time-to-time.",
    "Create a user account.",
    "Connect other online accounts with your Geeta University Alumni Association account, such as Facebook or LinkedIn.",
    "Submit online applications and forms to Geeta University Alumni Association.",
    "Subscribe to newsletters.",
  ],
  socialMediaNote:
    "If you use a social media platform or your mobile device (or other methods of communication) to interact with Geeta University Alumni Association, the communication method or application may have a specific and independent privacy policy that governs the use of Personal Information.",
  autoCollectionHeading: "Information Automatically Collected",
  autoCollectionText:
    "When you use our Services, we may collect certain information as described below to improve our Services, troubleshoot bugs, provide the Services, manage the Services, track usage, and provide content for referring traffic sources. Such information may include: IP address; profile information; aggregate user data; preferences; technical session information; browser type; information about your computer, hardware, software, or mobile device, including a device identifier; demographic information including zip code; and navigational data including log files, server logs, clickstream data, and language preference. User IP addresses are recorded for security and monitoring and for providing services. If you arrived at our website via a link from another webpage, we may receive aggregate or otherwise anonymous statistical information about your visit to our site. We monitor customer traffic patterns and site usage to help us develop the design of the site, and to improve the content of our website to better match the interests of our website users. We may combine this automatically collected and other Non-Personal Information with Personal Information, in which case we will treat the combined information as Personal Information under this Privacy Policy.",
};

export const defaultPrivacyPolicyHowWeUse: PrivacyPolicyHowWeUse = {
  heading: "How We Use Your Information",
  usesIntro:
    "We use Information collected about you or that you provide to us, including any Personal Information, to:",
  usesList: [
    "Operate and improve our website and Services.",
    "Provide Services to you.",
    "Track and analyze your use of our Services.",
    "Provide customer support, including support to our vendors or business partners.",
    "Communicate and provide additional information that may be of interest to you about Geeta University Alumni Association, our merchants, and our business partners, such as news, offers and coupons, announcements, and other relevant materials.",
    "Send you reminders, notices, updates, security alerts, support and administrative messages, service bulletins, or marketing materials.",
    "Administer contests or any promotional activities or events sponsored by us.",
    "Manage our everyday business needs, such as website administration, fulfillment of orders, analytics, fraud detection and prevention, compliance with the law or reporting obligation, or enforcement of our Terms of Service.",
    "Aggregate anonymous data from our Services used to benchmark, analyze, and improve the Services.",
  ],
  optOutNotice:
    "If you do not want to be on our mailing list, you can opt out anytime by sending an email to info@geetauniversity.edu.in or clicking on the “unsubscribe” button on our communications. From time to time, we may use your Personal Information to send important notices to you regarding material changes to our terms, conditions, and policies or purchased services which you may not opt out of receiving.",
};

export const defaultPrivacyPolicyDisclosureAndRights: PrivacyPolicyDisclosureAndRights = {
  heading: "Disclosure, Access & Data Security",
  disclosureHeading: "Disclosure of Your Information",
  disclosureIntro:
    "We may disclose Personal Information that we collect or you provide as described in this Policy:",
  disclosureList: [
    "To our service providers, which provide services for us including but not limited to sending emails on our behalf, processing payments, providing analytics services and helping us provide services as requested by users. Our service providers are bound by law or contract to protect Personal Information and are only allowed to use Personal Information in accordance with the terms of our service agreements with them. We do NOT share, sell, rent, or trade Personal Information with third parties for their own promotional purposes, and we will only share Personal Information as outlined herein or with your consent.",
    "We may also disclose your Personal Information: (1) To comply with any court order, law, or legal process, including to respond to any government or regulatory request; (2) To enforce or apply our Terms of Services and other agreements, including for billing and collection purposes; and (3) If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of Geeta University Alumni Association, our customers, or others. This includes exchanging information with other companies and organizations for the purposes of fraud protection and credit risk reduction.",
  ],
  accessRightsHeading: "Accessing and Correcting Your Information",
  accessRightsText:
    "You have the right to know whether your Personal Information has been stored and can consult with Geeta University Alumni Association about any Personal Information to verify the accuracy of such Information and receive a copy thereof. You have the right to have the Information supplemented, erased, updated, or corrected. For its transformation into anonymous format or to block any data held in violation of the law, requests should be sent to us by email at info@geetauniversity.edu.in. We will retain your information for as long as your account is active or as needed to provide you Services, conduct our internal operations, and to maintain a record of your transactions for financial reporting purposes. All Information will also be retained and used, as necessary, to comply with our legal obligations, resolve disputes, and enforce our agreements.",
  dataSecurityHeading: "Data Security",
  dataSecurityText:
    "The security of your Personal Information is important to Geeta University Alumni Association. We have implemented reasonable administrative, technical, and physical security measures designed to secure and protect your Information from accidental loss and from unauthorized access, use, alteration, and disclosure. HOWEVER, as the transmission of information via the internet is not completely secure, we cannot guarantee the security of information transmitted to our Services. Any transmission of Personal Information is at your own risk.",
};

export const defaultPrivacyPolicyAdditionalPolicies: PrivacyPolicyAdditionalPolicies = {
  heading: "Children's Privacy, Tracking & Contact",
  childrenHeading: "Children’s Personal Information",
  childrenText:
    "We do not knowingly collect or solicit Personal Information from anyone under the age of 16. If you are under 16, please do not attempt to register for the Services or send any Information about yourself to us. Parents and legal guardians are encouraged to monitor the activities of their wards in this regard. If we learn that we have collected Information from a child under age 16, we will delete that Information as quickly as possible. If you believe that a child under 16 may have provided us Information, please contact us at info@geetauniversity.edu.in",
  doNotTrackHeading: "“Do Not Track” Disclosures",
  doNotTrackText:
    "“Do Not Track” is a standard that is currently under development. As it is not yet finalized, Geeta University Alumni Association adheres to the standards set out in this Privacy Policy and does not monitor or respond to Do Not Track browser requests.",
  changesHeading: "Changes to our Privacy Policy",
  changesText:
    "Geeta University Alumni Association reserves the right to update this Policy from time to time. Geeta University Alumni Association will notify you of any changes and/or modifications to the Policy by updating the “Last Modified” date on this Policy, sending an electronic communication detailing the changes, posting a notification on the Services, or as required by law. Any changes or modifications will be effective immediately upon posting the updated Policy on Geeta University Alumni Association’s Services. You are encouraged to periodically review this Policy to stay informed of updates. Your continued use of Geeta University Alumni Association’s Services after receipt of such revised Policy will be deemed an acceptance of the revised Policy.",
  marketingHeading: "Communication & Direct Marketing Notice",
  marketingText:
    "When you voluntarily send us electronic mail, we will keep a record of this information so that we can respond to you. We only collect information from you when you register on our site or fill out a form. Also, when filling out a form on our site, you may be asked to enter your: name, e-mail address or phone number. You may, however, visit our site anonymously. In case you have submitted your personal information and contact details, we reserve the rights to Call, SMS, Email or WhatsApp about our products and offers, even if your number has DND activated on it.",
  contactHeading: "Contact Information",
  contactDescription:
    "To ask questions or comment about this Privacy Policy and our privacy practices, contact us at:",
  contactEmail: "info@geetauniversity.edu.in",
  contactPhone: "+91 92787 68000",
  contactAddress: "NH-71A, Naultha, Gohana Road, Panipat, Haryana 132145",
};

export const defaultPrivacyPolicyLegacyEcosystem: PrivacyPolicyLegacyEcosystem = {
  heading: "Legacy & Ecosystem",
  description:
    "Founded in 1985, the Geeta Group of Institutions has emerged as a major educational hub with institutions spanning school education to doctoral programs.",
  contextText: "SPBSB benefits from the integrated ecosystem of:",
  items: [
    {
      name: "Geeta University",
      detail: "AI-enabled multidisciplinary campus",
      color: "#E85C2D",
    },
    {
      name: "Geeta Finishing School (GFS)",
      detail: "Communication & Corporate Readiness",
      color: "#07589f",
    },
    {
      name: "Geeta Technical Hub (GTH)",
      detail: "Advanced Technology, Certifications, and Industry Skills",
      color: "#013d55",
    },
  ],
  footerText:
    "Together, they form a holistic, future-ready talent development ecosystem.",
  image: "/uploads/all/2080/campus.webp",
};

