export interface PolicyDocument {
  id: number;
  title: string;
  description: string;
  documentUrl: string;
}

export const policyDocuments: PolicyDocument[] = [
  {
    id: 1,
    title: "Sports Policy",
    description:
      "Framework governing sports, participation and sporting activities.",
    documentUrl:
      "/uploads/all/1381/Sports-Policy-2025.pdf",
  },
  {
    id: 2,
    title: "Policy of Research & Innovation Promotion",
    description:
      "Institutional framework supporting research, innovation and academic development.",
    documentUrl:
      "/uploads/all/1379/Research-and-Innovation-Promotion-Policy.pdf",
  },
  {
    id: 3,
    title: "Policy of Research Assistantship/Fellowship",
    description:
      "Guidelines governing research assistantships and fellowship opportunities.",
    documentUrl:
      "/uploads/all/1380/Research-Assistantship-policy.pdf",
  },
  {
    id: 4,
    title:
      "Policy of Promotion of Academic Integrity & Prevention of Plagiarism",
    description:
      "Framework promoting academic integrity and responsible scholarly practices.",
    documentUrl:
      "/uploads/all/1373/Policy-of-Promotion-of-Academic-Integrity-&-Prevention-of-Plagiarism.pdf",
  },
];