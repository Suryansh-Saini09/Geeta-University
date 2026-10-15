export interface GovernanceTableColumn {
  key: string;
  label: string;
}

export interface GovernanceTableRow {
  id: string;
  cells: string[];
  sortOrder: number;
}

export interface GovernanceTableData {
  version: 1;
  columns: GovernanceTableColumn[];
  rows: GovernanceTableRow[];
}

export interface GovernanceDocument {
  id: number | string;
  title: string;
  description: string;
  documentUrl: string;
  tableData?: GovernanceTableData | null;
}

export const governanceDocuments: GovernanceDocument[] = [
  {
    id: 1,
    title: "Board of Management",
    description:
      "Reconstitution and institutional composition of the Board of Management.",
    documentUrl:
      "https://geetauniversity.edu.in/uploads/all/2076/Board-of-Management-(Reconstitution).pdf",
  },
  {
    id: 2,
    title: "Academic Council",
    description:
      "Constitution and composition of the University's Academic Council.",
    documentUrl:
      "https://geetauniversity.edu.in/uploads/all/2075/Academic-Council-(Reconstituted).pdf",
  },
  {
    id: 3,
    title: "Governing Body",
    description:
      "Reconstitution and institutional structure of the Governing Body.",
    documentUrl:
      "https://geetauniversity.edu.in/uploads/all/2077/Governing-Body-(Reconstitution).pdf",
  },
  {
    id: 4,
    title: "Internal Complaints Committee",
    description:
      "Notification and constitution of the Internal Complaints Committee.",
    documentUrl:
      "https://geetauniversity.edu.in/uploads/all/2071/4.-Notification-Internal-Complaints-Committee.pdf",
  },
  {
    id: 5,
    title: "Finance Committee",
    description:
      "Reconstitution and composition of the University Finance Committee.",
    documentUrl:
      "https://geetauniversity.edu.in/uploads/all/1378/Reconstiution-of-University-Finance-Committee.pdf",
  },
];