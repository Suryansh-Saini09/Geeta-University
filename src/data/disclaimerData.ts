export interface DisclaimerHero {
  title: string;
  lastUpdated: string;
  heroImage: string;
  heroImageAlt: string;
  summaryText: string;
}

export interface DisclaimerStatement {
  title: string;
  publicServiceNotice: string;
  accuracyDisclaimer: string;
  liabilityDisclaimer: string;
  thirdPartyNotice: string;
  endorsementDisclaimer: string;
  image: string;
  imageAlt: string;
}

export interface DisclaimerPrivacyStatement {
  title: string;
  collectionNotice: string;
  commercialUseRestriction: string;
  serverLogsPolicy: string;
  cookiesPolicy: string;
  disclosurePolicy: string;
  externalLinksPolicy: string;
  revisionPolicy: string;
}

export interface DisclaimerContactInformation {
  heading: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

export interface DisclaimerLegacyEcosystem {
  heading: string;
  description: string;
  contextText: string;
  items: Array<{ name: string; detail: string; color: string }>;
  footerText: string;
  image: string;
}

export const defaultDisclaimerHero: DisclaimerHero = {
  title: "Disclaimer",
  lastUpdated: "June 19, 2023",
  heroImage: "/uploads/all/252/conversions/new-building-3-(1)-full.webp",
  heroImageAlt: "Geeta University Campus",
  summaryText:
    "Official website disclaimer, warranty disclosures, information accuracy statements, and privacy policies for Geeta University.",
};

export const defaultDisclaimerStatement: DisclaimerStatement = {
  title: "Official University Web Site Disclaimer",
  publicServiceNotice:
    "The Geeta University (GU) Web site is provided as a public service. Please note that users of this Web site are responsible for checking the accuracy, completeness, currency, and/ or suitability of all information.",
  accuracyDisclaimer:
    "The information was posted on the Geeta University. The website is current as of the posting date of the information. Geeta University makes no representations, guarantees, or warranties as to the accuracy, completeness, currency, or suitability of the information provided on this site.",
  liabilityDisclaimer:
    "Geeta University specifically disclaims any and all liability for any claims or damages that may result from providing the web site or the information it contains, including any Web sites maintained by third parties and linked to the Geeta University.",
  thirdPartyNotice:
    "The responsibility for content rests with the organizations that are providing the information. The inclusion of links from this site does not imply endorsement by Geeta University and makes no effort to independently verify and does not exert editorial control over information on pages outside the Web site.",
  endorsementDisclaimer:
    "Geeta University does not endorse unless specifically stated, any of the products, vendors, consultants, or documentation referenced in this Web site.",
  image: "/uploads/all/209/new-building-3-1024x504.webp",
  imageAlt: "Geeta University Academic Building",
};

export const defaultDisclaimerPrivacyStatement: DisclaimerPrivacyStatement = {
  title: "Web Site Privacy Policy Statement",
  collectionNotice:
    "You may visit our website without revealing any personal information wherever permissible. Certain transactions may require submission of personal information like profile updates and certain databases.",
  commercialUseRestriction:
    "We will not sell, swap or rent, or otherwise disclose to any third party any personal information for commercial purpose and such information will be utilized only for the purpose stated. To accomplish such purpose we may disclose the information to our employees, consultants and other concerned having a genuine need to know the information.",
  serverLogsPolicy:
    "Our web server may record the numerical Internet Protocol (IP) address of the computer you are using, Information about your browser and operating system, date and time of access and page which linked you to our website. This information may be used to administer and improve our website and to generate aggregate statistical reports and such like purposes.",
  cookiesPolicy:
    "We may use cookies and pixels or transparent GIF files to track session information and/or to deliver customizable and personalized services and information and/or for other purposes of website such information is anonymous and not personally identifiable.",
  disclosurePolicy:
    "Already disclaimer that any information collected ordinarily is not disclosed to third parties but may be disclosed in limited circumstances as and if required by law, court order, statutory bodies, rules & regulations or for improving our website or for the security of our network or for any purpose as deemed necessary.",
  externalLinksPolicy:
    "Our website contains links to other independently run websites within our network and to some websites outside our domain that are not controlled by us and are not covered by this privacy policy. We are not responsible for the privacy practices, security or content of such websites. While we make our best efforts to protect the privacy of users however we cannot ensure or warrant the security of any information you transmit to us, and you do so at your own risk.",
  revisionPolicy:
    "This privacy policy may be revised/modified/amended at any point of time at the sole discretion of the University.",
};

export const defaultDisclaimerContactInformation: DisclaimerContactInformation = {
  heading: "Disclaimer & Legal Inquiries",
  description:
    "If you require further verification of website content, official academic disclosures, or notice inquiries, contact our Legal & Administrative office.",
  email: "legal@geetauniversity.edu.in",
  phone: "+91-99960-31415",
  address: "NH-71, Naultha, Panipat, Haryana - 132145, India",
};

export const defaultDisclaimerLegacyEcosystem: DisclaimerLegacyEcosystem = {
  heading: "Legacy & Ecosystem",
  description:
    "Founded in 1985, the Geeta Group of Institutions has emerged as a major educational hub with institutions spanning school education to doctoral programs. SPBSB benefits from the integrated ecosystem of:",
  contextText: "Together, they form a holistic, future-ready talent development ecosystem.",
  items: [
    {
      name: "Geeta University",
      detail: "AI-enabled multidisciplinary campus",
      color: "orange",
    },
    {
      name: "Geeta Finishing School (GFS)",
      detail: "Communication & Corporate Readiness",
      color: "blue",
    },
    {
      name: "Geeta Technical Hub (GTH)",
      detail: "Advanced Technology, Certifications, and Industry Skills",
      color: "teal",
    },
  ],
  footerText: "Together, they form a holistic, future-ready talent development ecosystem.",
  image: "/uploads/all/2080/campus.webp",
};

