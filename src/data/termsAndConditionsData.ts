export interface TermsHero {
  title: string;
  lastUpdated: string;
  heroImage: string;
  heroImageAlt: string;
  summaryText: string;
}

export interface TermsAcceptanceAndWebsite {
  acceptanceTitle: string;
  acceptanceIntro: string;
  acceptanceTerms: string[];
  acceptanceNote: string;
  websiteTitle: string;
  websiteScope: string;
  websiteContentPolicy: string;
  thirdPartyNotice: string;
}

export interface TermsAccountAndConduct {
  accountTitle: string;
  accountText: string;
  conductTitle: string;
  conductIntro: string;
  prohibitedConduct: string[];
  securityRules: string;
  scrapingRules: string;
}

export interface TermsCommunicationsAndCommunities {
  commServicesTitle: string;
  commServicesText: string;
  alumniCommunitiesTitle: string;
  alumniCommunitiesText: string;
}

export interface TermsLiabilityAndLegal {
  liabilityTitle: string;
  warrantyDisclaimer: string;
  liabilityLimitation: string;
  governingLawTitle: string;
  governingLawText: string;
  indemnificationTitle: string;
  indemnificationText: string;
}

export interface TermsIpAndTermination {
  noticeTitle: string;
  noticeText: string;
  terminationTitle: string;
  terminationText: string;
  trademarksTitle: string;
  trademarksText: string;
  copyrightTitle: string;
  copyrightIntro: string;
  dmcaRequirements: string[];
  entireAgreementTitle: string;
  entireAgreementText: string;
}

export interface TermsContactInformation {
  heading: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

export interface TermsLegacyEcosystem {
  heading: string;
  description: string;
  contextText: string;
  items: Array<{ name: string; detail: string; color: string }>;
  footerText: string;
  image: string;
}

export const defaultTermsHero: TermsHero = {
  title: "Terms and Conditions",
  lastUpdated: "June 19, 2023",
  heroImage: "/uploads/all/252/conversions/new-building-3-(1)-full.webp",
  heroImageAlt: "Geeta University Campus",
  summaryText:
    "Read the terms and conditions for using Geeta University's website, alumni portals, digital resources, and online services.",
};

export const defaultTermsAcceptanceAndWebsite: TermsAcceptanceAndWebsite = {
  acceptanceTitle: "Your Acceptance",
  acceptanceIntro:
    "By using and/or visiting the Geeta University Alumni Association alumni Website you signify your agreement to:",
  acceptanceTerms: [
    "These terms and conditions (the “Terms of Use”); and",
    "The Geeta University Alumni Association privacy policy, which is incorporated here by reference.",
  ],
  acceptanceNote:
    "If you do not agree to any of these terms, or the privacy policy, please do not use this Website. Nothing in this Agreement shall be deemed to confer any third-party rights or benefits.",
  websiteTitle: "Website Scope & Services",
  websiteScope:
    "These Terms of Use apply to all users of the Website, including users who are contributors of content and other materials or services on the Website. The term Website shall be understood to include all aspects and services of the Geeta University Alumni Association alumni Website, including but not limited to all products, software and services offered via any website such as the blogs, groups, clubs, directories, discussion boards, job boards, mentor platforms, messaging, social and professional networking, photo and video uploading, commenting, mailing lists, and other applications.",
  websiteContentPolicy:
    "The Website electronically publishes news and information that may include facts, views, opinions and recommendations of individuals and organizations deemed of interest to alumni. Geeta University Alumni Association does not review, monitor, verify or guarantee the accuracy, completeness or timeliness of or otherwise endorse information provided by any organization or individual, give advice or advocate the purchase or sale of any product or service not directly offered by Geeta University Alumni Association or its affiliates. The Website may include unmoderated forums containing the personal opinions and other expressions of the persons who post entries on a wide range of topics. The text and other materials on these Website are the opinion of the specific author and are not statements of advice, opinion, or information of Geeta University Alumni Association.",
  thirdPartyNotice:
    "The Website may contain links to third-party websites that are not owned by, affiliated with or controlled by Geeta University Alumni Association. Geeta University Alumni Association has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites not directly affiliated with Geeta University Alumni Association. In addition, the Website will not and cannot censor or edit the content of any non-affiliated third-party site. By using the Website, you expressly release Geeta University Alumni Association from any and all liability arising from your use of any third-party website.",
};

export const defaultTermsAccountAndConduct: TermsAccountAndConduct = {
  accountTitle: "Your Account",
  accountText:
    "In order to access some features of the Website, you will have to create an account. By creating an account you agree to these Terms of Use and thereby agree to use of the Website in a manner consistent with all applicable laws and regulations and in accordance with the terms and conditions set out in the policies and guidelines outlined here. Please note that you will be referred to as “User” from time to time in this Agreement. You may never use another’s account. Your User account may not be shared, transferred, or sold to other parties. When creating your account, you must provide accurate and complete information. You are solely responsible for the activity that occurs on your account, and you must keep your account password secure. You must notify Geeta University Alumni Association immediately of any breach of security or unauthorized use of your account. Although Geeta University Alumni Association will not be liable for your losses caused by any unauthorized use of your account, you may be liable for the losses of Geeta University Alumni Association or others due to such unauthorized use.",
  conductTitle: "Rules for Online Conduct",
  conductIntro:
    "You agree to use the Website in accordance with all applicable laws. Because Geeta University Alumni Association is a nonprofit, tax-exempt organization, you agree that you will not use the Website for organized partisan political activities or commercial purposes. You further agree that you will use all of the services or information provided on the Website in accordance with the rules of conduct set forth below. This includes interactions with other users by email, web post, postal mail, or phone.",
  prohibitedConduct: [
    "Posting content that defames or threatens others",
    "Posting statements that are bigoted, hateful or racially offensive",
    "Posting content that infringes another’s intellectual property, including, but not limited to, copyrights, trademarks or trade secrets. When quoting copyrighted material, please adhere to the Electronic Frontier Foundation’s Fair Use Guidelines",
    "Posting material that contains obscene language or images",
    "Advertising or any form of commercial solicitation",
  ],
  securityRules:
    "You may not attempt to use or distribute tools designed for compromising security or take any action to compromise the security of this site. Examples of these tools include but are not limited to password guessing programs, cracking tools or network probing tools. You may not “flood” or disrupt the Website through any means or process.",
  scrapingRules:
    "You may not copy, scrape, download, export or otherwise capture any data obtained in the Website, e.g., the alumni directory, and/or store it outside of the system, e.g., in a separate spreadsheet, email list, database or other external repository without the permission of Geeta University Alumni Association. Geeta University Alumni Association may grant permission by configuring User accounts to allow such activities. You agree that you will not access or attempt to access any other user’s account, or misrepresent or attempt to misrepresent your identity while using the Website.",
};

export const defaultTermsCommunicationsAndCommunities: TermsCommunicationsAndCommunities = {
  commServicesTitle: "Online Communication Services",
  commServicesText:
    "Communication services provided through the Website, such as the directory, online communities, discussion boards, blogs, messaging, social and professional networking, and other services in the future, are a part of the Website designed for communication between Users. Geeta University Alumni Association will not monitor these communications, but reserves the right to take action against any User who defames or harasses another User through any of the services offered through the Website, if it comes to Geeta University Alumni Association’s attention.",
  alumniCommunitiesTitle: "Online Alumni Communities",
  alumniCommunitiesText:
    "Geeta University Alumni Association provides a platform on which alumni can create and join online alumni communities based on shared interests or experiences. Participants in online alumni communities may not represent or imply that their opinions represent those of Geeta University Alumni Association. Geeta University Alumni Association reserves the right to remove all or any portion of an online alumni community’s information from the platform at any time and at Geeta University Alumni Association’s sole discretion. All online alumni community participants and organizers agree not to post or facilitate the posting of any material in violation of these Terms of Use. Online alumni community participants and organizers also agree to provide reasonable assistance at the request of Geeta University Alumni Association and its representatives to address any violations of this policy as determined by Geeta University Alumni Association. Participants and organizers also agree not to use the online alumni community for any activity that violates any federal, state or local law.",
};

export const defaultTermsLiabilityAndLegal: TermsLiabilityAndLegal = {
  liabilityTitle: "Disclaimer of Warranty / Limitation of Liability",
  warrantyDisclaimer:
    "Geeta University Alumni Association does not warrant that the Website will operate in an uninterrupted or error-free manner or that the Website is free of viruses or other harmful components. Use of information obtained from or through these Website is at your own risk.",
  liabilityLimitation:
    "YOU AGREE THAT Geeta University Alumni Association WILL NOT BE LIABLE TO YOU FOR ANY LOSS OR DAMAGES, EITHER ACTUAL OR CONSEQUENTIAL, ARISING OUT OF OR RELATING TO THESE TERMS OF USE, OR TO YOUR (OR ANY THIRD PARTY’S) USE OR INABILITY TO USE THE WEBSITE, OR TO YOUR PLACEMENT OF CONTENT ON THE WEBSITE, OR TO YOUR RELIANCE UPON INFORMATION OBTAINED FROM OR THROUGH THE WEBSITE. IN PARTICULAR, Geeta University Alumni Association WILL HAVE NO LIABILITY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, PUNITIVE, SPECIAL OR INCIDENTAL DAMAGES, WHETHER FORESEEABLE OR UNFORESEEABLE, (INCLUDING, BUT NOT LIMITED TO, CLAIMS FOR DEFAMATION, ERRORS, MISUSE OF EMAIL OR OTHER SERVICES, LOSS OF DATA, OR INTERRUPTION IN AVAILABILITY OF DATA), ARISING OUT OF OR RELATING TO THESE TERMS, YOUR USE OF OR INABILITY TO USE A WEBSITE, OR ANY PURCHASES ON THE WEBSITE, OR YOUR PLACEMENT OF CONTENT ON A WEBSITE, OR YOUR RELIANCE UPON INFORMATION OBTAINED FROM OR THROUGH A WEBSITE, WHETHER BASED IN CONTRACT, TORT, STATUTORY OR OTHER LAW, EXCEPT ONLY TO THE EXTENT THAT APPLICABLE LAW REQUIRES SUCH LIABILITY. Geeta University Alumni Association makes no representation regarding your ability to transmit and receive information from or through the Website and you agree and acknowledge that your ability to access the Website may be impaired. Geeta University Alumni Association disclaims any and all liability resulting from or related to such events.",
  governingLawTitle: "Choice of Law / Forum Selection",
  governingLawText:
    "All matters relating to the Website and these Terms of Use and any dispute or claim arising therefrom or related thereto (in each case, including non-contractual disputes or claims), shall be governed by and construed in accordance with the internal laws of the State of California without giving effect to any choice or conflict of law provision or rule. Any legal suit, action or proceeding arising out of, or related to, these Terms of Use or the Website shall be instituted exclusively in the federal courts of the United States or the courts of the State of California located in the county of San Francisco. You waive any and all objections to the exercise of jurisdiction over you by such courts and to venue in such courts.",
  indemnificationTitle: "Indemnification",
  indemnificationText:
    "You agree to defend, indemnify and hold Geeta University Alumni Association, its trustees, officers, employees and agents harmless from any claims, losses or damages, including legal fees, resulting from your violation of these Terms of Use, your use of the Website or your placement of any content onto the Website, and to fully cooperate in Geeta University Alumni Association’s defense against any such claims.",
};

export const defaultTermsIpAndTermination: TermsIpAndTermination = {
  noticeTitle: "Notice of Modifications",
  noticeText:
    "Geeta University Alumni Association reserves the right to update this Terms of Use from time to time. Geeta University Alumni Association will notify you of any changes and/or modifications by updating the “Last Modified” date on this page, sending an electronic communication detailing the changes, posting a notification on the Services, or as required by law. Any changes or modifications will be effective immediately upon posting the update on Geeta University Alumni Association’s Services. You are encouraged to periodically review these Terms of Use to stay informed of updates. Your continued use of Geeta University Alumni Association’s Services after receipt of such revised Terms of Use will be deemed an acceptance of the changes.",
  terminationTitle: "Termination of Service",
  terminationText:
    "User may terminate this Agreement by cancelling his or her account. To do this the user must contact Geeta University Alumni Association through phone or mail as listed below. Geeta University Alumni Association may terminate your account or access rights to the Website at any time, without notice, for conduct that Geeta University Alumni Association believes violates this Agreement or other policies or guidelines that Geeta University Alumni Association has posted. Geeta University Alumni Association may terminate your account or your access rights to the Website for online conduct that Geeta University Alumni Association believes is harmful to other Users, to Geeta University Alumni Association’s business, or to other information providers.",
  trademarksTitle: "Trademarks",
  trademarksText:
    "The logo, name and all graphics on the Website or its affiliates are trademarks of Geeta University Alumni Association or its affiliates. You must not use, reproduce, copy, or redistribute such marks without the prior written permission of Geeta University Alumni Association or its affiliates. All other trademarks or service marks appearing on the Website are the marks of their respective owners.",
  copyrightTitle: "Copyright License & DMCA Complaints",
  copyrightIntro:
    "Owners of posted materials grants Geeta University Alumni Association a non-exclusive, royalty-free, perpetual license to reproduce and distribute any content posted on the Website. Geeta University Alumni Association respects the intellectual property rights of others and complies with the Digital Millennium Copyright Act (DMCA). If you believe your copyright has been violated on the Website, please provide the following information:",
  dmcaRequirements: [
    "The name, address, and physical or electronic signature of the complaining party",
    "Identification of the infringing materials and their Internet location, or if the service provider is an “information location tool” such as a search engine, the reference or link to the infringing materials",
    "Sufficient information to identify the copyrighted works",
    "A statement by the copyright holder of a good faith belief that there is no legal basis for the use complained of",
    "A statement of the accuracy of the notice and, under penalty of perjury, that the complaining party is authorized to act on the behalf of the copyright holder",
  ],
  entireAgreementTitle: "Entire Agreement",
  entireAgreementText:
    "The Terms of Use and our Privacy Policy constitute the sole and entire agreement between you and Geeta University Alumni Association with respect to the Website and supersede all prior and contemporaneous understandings, agreements, representations and warranties, both written and oral, with respect to the Website.",
};

export const defaultTermsContactInformation: TermsContactInformation = {
  heading: "Contact Information",
  description: "To ask questions or comment about this Terms of Use, contact us at:",
  email: "info@geetauniversity.edu.in",
  phone: "+91 92787 68000",
  address: "NH-71A, Naultha, Gohana Road, Panipat, Haryana 132145",
};

export const defaultTermsLegacyEcosystem: TermsLegacyEcosystem = {
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

