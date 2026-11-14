export interface UGCDocument {
  id: string;
  title: string;
  filename: string;
  description: string;
  fileUrl: string;
  fileType: "PDF Document" | "PDF Presentation" | "Media Drive";
  iconName: string;
  isExternal?: boolean;
}

export interface UGCApproval {
  id: string;
  title: string;
  body: string;
  actOrSection: string;
  description: string;
  badgeText: string;
  iconName: string;
}

export const ugcHeroData = {
  title: "UGC Accreditation & Statutory Documents",
  subtitle: "Virtual Inspection & Compliance Performa (State Private University)",
  description:
    "Geeta University, Panipat, Haryana is a recognized State Private University established under the Haryana Private Universities Act, 2006 and recognized by the University Grants Commission (UGC) under Section 2(f) & Section 22 of the UGC Act 1956.",
  inspectionTitle:
    "Virtual inspection of Geeta University, Panipat, Haryana to ascertain fulfillment of various parameters as per UGC regulations",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "UGC Documents", href: "/ugc" },
  ],
};

export const ugcDocuments: UGCDocument[] = [
  {
    id: "annexure-1",
    title: "UGC Inspection Performa (Annexure 1)",
    filename: "01-Annexure-1.pdf",
    description:
      "Official UGC Performa (July 2024) containing comprehensive data on academic infrastructure, governance, faculty strength, and course offerings.",
    fileUrl:
      "/uploads/all/360/00-Geeta-University-UGC-Performa-2024-09.07.24.pdf",
    fileType: "PDF Document",
    iconName: "FileText",
  },
  {
    id: "inspection-ppt",
    title: "Presentation in Support of UGC Inspection",
    filename: "02-PPT in support of the information furnished.pdf",
    description:
      "Detailed presentation slides submitted to the UGC Expert Committee highlighting university milestones, AI-enabled labs, and student outcomes.",
    fileUrl:
      "/uploads/all/362/02-PPT-in-support-of-the-information-furnished.pdf",
    fileType: "PDF Presentation",
    iconName: "Presentation",
  },
  {
    id: "supporting-docs",
    title: "Evidentiary Soft Copies & Statutory Certificates",
    filename: "03-Soft Copies of the documents in support of the information.pdf",
    description:
      "Compiled evidentiary proof, land titles, building safety approvals, laboratory inventories, library catalogs, and faculty credentials.",
    fileUrl:
      "https://geetauniversity.edu.in/public/uploads/pdf/03-Soft-Copies-of-the-documents-in-support-of-the-information_compressed-compressed.pdf",
    fileType: "PDF Document",
    iconName: "FolderCheck",
  },
  {
    id: "geotagged-media",
    title: "Geo-Tagged Infrastructure Media & Video Walkthroughs",
    filename: "04-Geo-Tagged photos and videos",
    description:
      "High-resolution geo-tagged photographs and video footage verifying campus facilities, smart classrooms, hostels, and sports complexes.",
    fileUrl:
      "https://drive.google.com/file/d/1rkt6jIE6uy_2D5NEX_N-_793KYhqU6Y2/view?usp=sharing",
    fileType: "Media Drive",
    iconName: "Video",
    isExternal: true,
  },
];

export const ugcApprovalsList: UGCApproval[] = [
  {
    id: "ugc-2f-22",
    title: "University Grants Commission (UGC)",
    body: "Ministry of Education, Govt. of India",
    actOrSection: "Section 2(f) & Section 22(1)",
    description:
      "Geeta University is recognized under Section 2(f) of the UGC Act 1956, empowering the university to award degrees under Section 22(1).",
    badgeText: "Statutory UGC Approval",
    iconName: "Award",
  },
  {
    id: "haryana-act",
    title: "Government of Haryana Recognition",
    body: "Department of Higher Education, Haryana",
    actOrSection: "Haryana Private Universities Act 2006",
    description:
      "Duly enacted by the Haryana State Legislature to deliver world-class higher education, multidisciplinary research, and professional degrees.",
    badgeText: "State Act Enactment",
    iconName: "Landmark",
  },
  {
    id: "pci-approval",
    title: "Pharmacy Council of India (PCI)",
    body: "Statutory Body for Pharmacy Education",
    actOrSection: "Pharmacy Act, 1948",
    description:
      "All Pharmacy programs (B.Pharm & D.Pharm) at Geeta Institute of Pharmacy are recognized and approved by the Pharmacy Council of India.",
    badgeText: "PCI Approved",
    iconName: "ShieldCheck",
  },
  {
    id: "bci-approval",
    title: "Bar Council of India (BCI)",
    body: "Statutory Body for Legal Education",
    actOrSection: "Advocates Act, 1961",
    description:
      "Geeta Global Law School offers BCI-approved 5-Year Integrated BA LL.B (Hons), BBA LL.B (Hons), and 3-Year LL.B professional degrees.",
    badgeText: "BCI Approved",
    iconName: "Scale",
  },
];
