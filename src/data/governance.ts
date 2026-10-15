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
  description?: string | null;
  documentUrl?: string | null;
  tableData?: GovernanceTableData | null;
}

export const governanceDocuments: GovernanceDocument[] = [
  {
    id: 1,
    title: "Board of Management",
    description: null,
    documentUrl: "",
  },
  {
    id: 2,
    title: "Academic Council",
    description: null,
    documentUrl: "",
  },
  {
    id: 3,
    title: "Governing Body",
    description: null,
    documentUrl: "",
  },
  {
    id: 4,
    title: "Internal Complaints Committee",
    description: null,
    documentUrl: "",
  },
  {
    id: 5,
    title: "Finance Committee",
    description: null,
    documentUrl: "",
  },
];