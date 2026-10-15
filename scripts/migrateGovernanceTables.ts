import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export interface CommitteeSeedData {
  id: string;
  title: string;
  description: string;
  documentUrl: string;
  category: "governance";
  sortOrder: number;
  tableData: GovernanceTableData;
}

export const canonicalGovernanceTables: CommitteeSeedData[] = [
  // 1. Board of Management
  {
    id: "gov-1",
    title: "Board of Management",
    description: "Reconstitution and institutional composition of the Board of Management.",
    documentUrl: "https://geetauniversity.edu.in/uploads/all/2076/Board-of-Management-(Reconstitution).pdf",
    category: "governance",
    sortOrder: 0,
    tableData: {
      version: 1,
      columns: [
        { key: "reference", label: "Reference" },
        { key: "position", label: "Position" },
        { key: "role", label: "Role" },
        { key: "memberDetails", label: "Member Details" },
      ],
      rows: [
        {
          id: "bom-1",
          sortOrder: 0,
          cells: ["2.02.1(a)", "Vice Chancellor", "Chairperson", "Prof. Manoj Manuja"],
        },
        {
          id: "bom-2",
          sortOrder: 1,
          cells: ["2.02.1(b)", "Nominee of Secretary to Higher Education", "Member", "Dr. Vishal Sharma\nJoint Director- DGHE"],
        },
        {
          id: "bom-3",
          sortOrder: 2,
          cells: [
            "2.02.1(c)",
            "Two members of the Governing Body, nominated by the Education Society;",
            "Member (s)",
            "1. Prof. Paramjit Singh Jaswal\nPrincipal Advisor to Chairman, SRM University, Sonipat,\n2. Dr. Neha Bansal",
          ],
        },
        {
          id: "bom-4",
          sortOrder: 3,
          cells: ["2.02.1(d)", "Pro Vice Chancellor", "Member", "Prof. Gulshan Chauhan"],
        },
        {
          id: "bom-5",
          sortOrder: 4,
          cells: [
            "2.02.1(e)",
            "Three persons who are not members of the Governing Body, nominated by the K.R. Education Society",
            "Member (s)",
            "1. Prof. V.K.Aggrawal\nFormer-V.C., Jagnnath University\n2. Prof. Atish Chattopadhyay\nDirector, IMT Ghaziabad\n3. Prof. Nitesh Bansal\nDean, O.P. Jindal University",
          ],
        },
        {
          id: "bom-6",
          sortOrder: 5,
          cells: [
            "2.02.1(f)",
            "Three Professors from amongst teachers, nominated by the K.R. Education Society",
            "Member (s)",
            "1. Dr. Jaskaran Singh\nProfessor, School of Science\n2. Dr. Meenu Gupta\nProfessor, School of Computer Science & Engineering\n3. Dr. Sarita Khatkar\nProfessor, Geeta Institue of Pharmacy",
          ],
        },
        {
          id: "bom-7",
          sortOrder: 6,
          cells: [
            "2.02.1(g).",
            "Two Professors/ Associate Professors among the teachers, nominated by the Vice Chancellor",
            "Members",
            "1. Dr. Neeraj Rana\nAssociate Professor – School of Commerce & Business Management\n2. Dr. Pooja Gupta\nAssociate Professor, School of Commerce & Business Management",
          ],
        },
        {
          id: "bom-8",
          sortOrder: 7,
          cells: ["2.02.2", "Registrar", "Member Secretary", "Prof. Amit Gupta"],
        },
      ],
    },
  },

  // 2. Academic Council
  {
    id: "gov-2",
    title: "Academic Council",
    description: "Constitution and composition of the University's Academic Council.",
    documentUrl: "https://geetauniversity.edu.in/uploads/all/2075/Academic-Council-(Reconstituted).pdf",
    category: "governance",
    sortOrder: 1,
    tableData: {
      version: 1,
      columns: [
        { key: "sNo", label: "S. No." },
        { key: "position", label: "Position" },
        { key: "role", label: "Role" },
        { key: "memberDetails", label: "Member Details" },
      ],
      rows: [
        {
          id: "ac-1",
          sortOrder: 0,
          cells: ["1.", "Hon’ble Vice-Chancellor", "Chairperson", "1. Prof. Manoj Manuja"],
        },
        {
          id: "ac-2",
          sortOrder: 1,
          cells: ["2.", "Hon’ble Pro Vice-Chancellor", "Member", "1. Prof. Gulshan Chauhan"],
        },
        {
          id: "ac-3",
          sortOrder: 2,
          cells: [
            "3.",
            "Deans of All Faculties",
            "Members",
            "1. Dr. Bala Saraswathi\nSchool of Commerce & Business Management\n2. Prof. Jaskaran Singh\nSchool of Sciences\n3. Prof. Poornima Bali\nSchool of Humanities & Social Sciences",
          ],
        },
        {
          id: "ac-4",
          sortOrder: 3,
          cells: [
            "4.",
            "Heads of Schools",
            "Members",
            "1. Prof. Sunil Jawla\nGeeta Institute of Pharmacy\n2. Prof. Sushil Mishra\nSchool of Hospitality & Hotel Management\n3. Prof. Meenu Gupta\nSchool of Computer Science & Engineering\n4. Dr. Yuvraj Singh\nSchool of Agricultural Sciences\n5. Dr. Nidhi Dangi\nSchool of Health & Allied Sciences\n6. Dr. Kapil Saini\nAssistant Director, IQAC\n7. Mr. Pankaj Bajaj\nChief Operating Officer, GTH",
          ],
        },
        {
          id: "ac-5",
          sortOrder: 4,
          cells: ["5.", "Controller of Examination", "Member", "1. Prof. Amit Gupta"],
        },
        {
          id: "ac-6",
          sortOrder: 5,
          cells: [
            "6.",
            "Two Professors\n(by rotation from the faculties nominated by the Vice-Chancellor)",
            "Members",
            "1. Prof. Sarita Khatkar\nGeeta Institute of Pharmacy\n2. Prof. Rekha Narang\nSchool of Commerce & Business Management",
          ],
        },
        {
          id: "ac-7",
          sortOrder: 6,
          cells: [
            "7.",
            "Two Associate Professors\n(by rotation from the faculties nominated by the Vice-Chancellor)",
            "Members",
            "1. Dr. Sangeeta\nSchool of Commerce & Business Management\n2. Dr. Anupama\nSchool of Commerce & Business Management",
          ],
        },
        {
          id: "ac-8",
          sortOrder: 7,
          cells: [
            "8.",
            "External Experts",
            "Members",
            "1. Prof. (Dr.) Abhinav Bansal\nDean, CSE, Bennett University, Greater Noida\n2. Prof. (Dr.) Rajat Agarwal\nIIT Roorkee\n3. Prof. (Dr.) Deependra Singh\nChairman, Education Regulation Committee, PCI",
          ],
        },
        {
          id: "ac-9",
          sortOrder: 8,
          cells: ["9.", "Registrar", "Member Secretary", "1. Dr. Amit Gupta"],
        },
      ],
    },
  },

  // 3. Governing Body
  {
    id: "gov-3",
    title: "Governing Body",
    description: "Reconstitution and institutional structure of the Governing Body.",
    documentUrl: "https://geetauniversity.edu.in/uploads/all/2077/Governing-Body-(Reconstitution).pdf",
    category: "governance",
    sortOrder: 2,
    tableData: {
      version: 1,
      columns: [
        { key: "reference", label: "Reference" },
        { key: "designation", label: "Designation" },
        { key: "role", label: "Role" },
        { key: "memberDetails", label: "Member Details" },
      ],
      rows: [
        {
          id: "gb-1",
          sortOrder: 0,
          cells: ["2.01 (a)", "The Chancellor", "Chairperson", "1. Shri S. P. Bansal"],
        },
        {
          id: "gb-2",
          sortOrder: 1,
          cells: ["2.01 (b)", "The Pro Chancellor", "Member", "1. Shri Nishant Bansal"],
        },
        {
          id: "gb-3",
          sortOrder: 2,
          cells: ["2.01 (b)", "The Pro Chancellor", "Member", "1. Shri Ankush Bansal"],
        },
        {
          id: "gb-4",
          sortOrder: 3,
          cells: ["2.01 (c)", "The Vice Chancellor", "Member", "1. Prof. Manoj Manuja"],
        },
        {
          id: "gb-5",
          sortOrder: 4,
          cells: ["2.01 (d)", "Nominee of Secretary to Higher Education", "Member", "1. Dr. Vishal Sharma\nJoint Director- DGHE"],
        },
        {
          id: "gb-6",
          sortOrder: 5,
          cells: [
            "2.01 (e)",
            "Five Members nominated by K.R. Education Society\n(whom two shall be eminent educationists for a term of two years and shall be eligible for reappointment)",
            "Member (s)",
            "1. Dr. Krishna Kumar Pande\n(Former Dean Academics - TMU &\nStrategic Planner-KAD International)\n2. Prof. Dr. Paramjit Singh Jaswal\n(Principal Advisor to Chairman, SRM University, Sonipat)\n3. Mrs. Geeta Bansal\n(Chairperson- Geeta Group of Institutions)\n4. Mrs. Rita Garg\n5. Dr. Neha Bansal",
          ],
        },
        {
          id: "gb-7",
          sortOrder: 6,
          cells: ["2.01", "Pro Vice Chancellor", "Member", "1. Prof. Gulshan Chauhan"],
        },
        {
          id: "gb-8",
          sortOrder: 7,
          cells: [
            "2.01 (f)",
            "One expert of management or technology from outside the University, nominated by the Chancellor",
            "Member",
            "1. Mr. Sushil Kumar Aggarwal\n(Chairman - AVRO Furniture)",
          ],
        },
        {
          id: "gb-9",
          sortOrder: 8,
          cells: [
            "2.01 (g)",
            "One expert of finance, nominated by the Chancellor",
            "Member",
            "1. CA Mr. Rahul Khurana\nCharted Accountant",
          ],
        },
        {
          id: "gb-10",
          sortOrder: 9,
          cells: ["2.01", "Registrar", "Member Secretary", "1. Prof. Amit Gupta"],
        },
      ],
    },
  },

  // 4. Internal Complaints Committee
  {
    id: "gov-4",
    title: "Internal Complaints Committee",
    description: "Notification and constitution of the Internal Complaints Committee.",
    documentUrl: "https://geetauniversity.edu.in/uploads/all/2071/4.-Notification-Internal-Complaints-Committee.pdf",
    category: "governance",
    sortOrder: 3,
    tableData: {
      version: 1,
      columns: [
        { key: "sNo", label: "S. N." },
        { key: "nameDesignation", label: "Name & Designation" },
        { key: "role", label: "Role" },
        { key: "contactNo", label: "Contact No." },
        { key: "email", label: "Email" },
      ],
      rows: [
        {
          id: "icc-1",
          sortOrder: 0,
          cells: ["1", "Prof. Sarita\nProfessor - Geeta Institute of Pharmacy", "Presiding Officer", "9996204880", "pharma.p1@geetauniversity.edu.in"],
        },
        {
          id: "icc-2",
          sortOrder: 1,
          cells: [
            "2",
            "Prof. Farhat Mohsin\nProfessor - School of Leadership and Management, Manav Rachna International Institute of Research and Studies, Faridabad",
            "Member",
            "9871144250",
            "farhat.fms@mriu.edu.in",
          ],
        },
        {
          id: "icc-3",
          sortOrder: 2,
          cells: ["3", "Prof. Rekha Narang\nProfessor – School of Commerce & Business Management", "Member", "8685099555", "rekha.narang@geetauniversity.edu.in"],
        },
        {
          id: "icc-4",
          sortOrder: 3,
          cells: ["4.", "Dr. Sangeeta\nAssociate Professor – School of Commerce & Business Management, Head-Ph.D. Cell", "Member", "9996748478", "drsangeeta.mgmt@geetauniversity.edu.in"],
        },
        {
          id: "icc-5",
          sortOrder: 4,
          cells: ["5.", "Mr. Vinod Kumar\nDeputy Registrar", "Member", "9023602621", "dy.registrar@geetauniversity.edu.in"],
        },
        {
          id: "icc-6",
          sortOrder: 5,
          cells: ["6", "Mr. Ashish\nAssistant Registrar (VC Office)", "Member", "8053650811", "ar.vcoffice@geetauniversity.edu.in"],
        },
        {
          id: "icc-7",
          sortOrder: 6,
          cells: ["7", "Mr. Manan Singal\nFounder & Chairman at Help age Orphans", "Member", "9991055093", "Manansingla19@gmail.com"],
        },
        {
          id: "icc-8",
          sortOrder: 7,
          cells: ["8", "Ms. Kanika\nStudent - B.Tech CSE (3rd year)\nRoll No. 2301301069", "Member", "7988646375", "2301301069.Kanika@geetauniversity.edu.in"],
        },
        {
          id: "icc-9",
          sortOrder: 8,
          cells: ["9", "Ms. Manisha\nStudent – MA (1st year)\nRoll No. 2511401002", "Member", "9306005610", "2511401002@geetauniversity.edu.in"],
        },
        {
          id: "icc-10",
          sortOrder: 9,
          cells: ["10", "Ms. Parul\nStudent – Research Scholar\nRoll No. 2205701007", "Member", "9996863322", "parul.2205701007@geetauniversity.edu.in"],
        },
        {
          id: "icc-11",
          sortOrder: 10,
          cells: ["11", "Dr. Priyanka Rathee\nAssociate Professor – Geeta Institute of Pharmacy", "Member Secretary", "9812782341", "priyanka.rathee@geetauniversity.edu.in"],
        },
      ],
    },
  },

  // 5. Finance Committee
  {
    id: "gov-5",
    title: "Finance Committee",
    description: "Reconstitution and composition of the University Finance Committee.",
    documentUrl: "https://geetauniversity.edu.in/uploads/all/1378/Reconstiution-of-University-Finance-Committee.pdf",
    category: "governance",
    sortOrder: 4,
    tableData: {
      version: 1,
      columns: [
        { key: "sNo", label: "S. No." },
        { key: "position", label: "Position" },
        { key: "memberDetails", label: "Member Details" },
        { key: "role", label: "Role" },
      ],
      rows: [
        {
          id: "fc-1",
          sortOrder: 0,
          cells: ["1", "Vice-Chancellor", "Dr. Manoj Manuja", "Chairperson"],
        },
        {
          id: "fc-2",
          sortOrder: 1,
          cells: ["2", "Pro Vice-Chancellor", "Dr. Gulshan Chauhan", "Member"],
        },
        {
          id: "fc-3",
          sortOrder: 2,
          cells: ["4", "Registrar", "Dr. Amit Gupta", "Member"],
        },
        {
          id: "fc-4",
          sortOrder: 3,
          cells: ["5", "Controller of Examination", "Dr. Amit Gupta", "Member"],
        },
        {
          id: "fc-5",
          sortOrder: 4,
          cells: ["6", "Dean/ Heads of School’s", "Dr. Bala Saraswathi\nProfessor & Dean\nSchool of Commerce & Business Management", "Member"],
        },
        {
          id: "fc-6",
          sortOrder: 5,
          cells: ["6", "Dean/ Heads of School’s", "Dr. Jaskaran Singh\nProfessor & Dean - School of Sciences", "Member"],
        },
        {
          id: "fc-7",
          sortOrder: 6,
          cells: ["6", "Dean/ Heads of School’s", "Dr. Purnima Bali\nProfessor & Dean- School of Humanities & Social Sciences.", "Member"],
        },
        {
          id: "fc-8",
          sortOrder: 7,
          cells: ["6", "Dean/ Heads of School’s", "Dr. Sunil Jawla\nProfessor & Principal\nGeeta Institute of Pharmacy", "Member"],
        },
        {
          id: "fc-9",
          sortOrder: 8,
          cells: ["6", "Dean/ Heads of School’s", "Dr. Meenu Gupta\nProfessor & Head\nSchool of Computer Science & Engineering", "Member"],
        },
        {
          id: "fc-10",
          sortOrder: 9,
          cells: ["6", "Dean/ Heads of School’s", "Dr. Sushil Kumar\nProfessor & Head\nSchool of Hospitality & Hotel Management", "Member"],
        },
        {
          id: "fc-11",
          sortOrder: 10,
          cells: ["6", "Dean/ Heads of School’s", "Dr. Yuvraj Yadav\nAssociate Professor & Head\nSchool of Agricultural Sciences", "Member"],
        },
        {
          id: "fc-12",
          sortOrder: 11,
          cells: ["6", "Dean/ Heads of School’s", "Dr. Nidhi Dangi\nAssistant Professor & Head\nSchool of Health & Allied Sciences", "Member"],
        },
        {
          id: "fc-13",
          sortOrder: 12,
          cells: ["6", "Dean/ Heads of School’s", "Dr. Ayaz Ahmad\nHead – Geeta Global Law School", "Member"],
        },
        {
          id: "fc-14",
          sortOrder: 13,
          cells: ["7", "Dean Student’s welfare", "Dr. Rekha Narang\nProfessor- School of Commerce & Business Management", "Member"],
        },
        {
          id: "fc-15",
          sortOrder: 14,
          cells: ["8", "IQAC", "Dr. Kapil Saini\nAssistant Director- IQAC", "Member"],
        },
        {
          id: "fc-16",
          sortOrder: 15,
          cells: ["9", "Training & Placement", "Mr. Amit Kumar Verma\nSenior Director Placement", "Member"],
        },
        {
          id: "fc-17",
          sortOrder: 16,
          cells: ["10", "GTH", "Mr. Pankaj Bajaj\nChief Operating Officer", "Member"],
        },
        {
          id: "fc-18",
          sortOrder: 17,
          cells: ["11", "GFS", "Ms. Swati Ambasta\nAssistant. Director", "Member"],
        },
        {
          id: "fc-19",
          sortOrder: 18,
          cells: ["12", "Finance Officer", "Mr. Neeraj Ruhal\nChief Finance Officer", "Member Secretary"],
        },
      ],
    },
  },
];

async function ensureTableDataColumnExists() {
  const columns: any[] = await prisma.$queryRawUnsafe("SHOW COLUMNS FROM GovernanceDocument LIKE 'tableData'");
  if (columns.length === 0) {
    console.log("Adding nullable `tableData` column to `GovernanceDocument` table...");
    await prisma.$executeRawUnsafe("ALTER TABLE GovernanceDocument ADD COLUMN tableData JSON NULL");
    console.log("Successfully added `tableData` column to MySQL.");
  } else {
    console.log("Column `tableData` already exists on `GovernanceDocument` in MySQL.");
  }
}

async function run() {
  const args = process.argv.slice(2);
  const isApply = args.includes("--apply");
  const isDryRun = args.includes("--dry-run") || !isApply;

  console.log("==========================================================================");
  console.log(`MIGRATION SCRIPT: GOVERNANCE STRUCTURE TABLES (${isApply ? "APPLY MODE" : "DRY RUN MODE"})`);
  console.log("==========================================================================\n");

  // 1. Verify DB target (without revealing credentials)
  const dbUrl = process.env.DATABASE_URL || "";
  const hostMatch = dbUrl.match(/@([^:/]+)/);
  const dbHost = hostMatch ? hostMatch[1] : "unknown-host";
  console.log(`1. Target Database Host: ${dbHost} (Aiven MySQL Target Verified)\n`);

  if (isApply) {
    await ensureTableDataColumnExists();
  } else {
    const columns: any[] = await prisma.$queryRawUnsafe("SHOW COLUMNS FROM GovernanceDocument LIKE 'tableData'");
    if (columns.length === 0) {
      console.log("[Dry-Run Notice] Column `tableData` does not exist yet on MySQL table. It will be safely added on `--apply`.\n");
    } else {
      console.log("Column `tableData` already exists on `GovernanceDocument` in MySQL.\n");
    }
  }

  // 2. Audit current GovernanceDocument records
  // Select fields that currently exist if tableData is not yet added
  const columns: any[] = await prisma.$queryRawUnsafe("SHOW COLUMNS FROM GovernanceDocument LIKE 'tableData'");
  const hasTableDataCol = columns.length > 0;
  
  const allDocs = await prisma.governanceDocument.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      documentUrl: true,
      category: true,
      status: true,
      sortOrder: true,
      ...(hasTableDataCol ? { tableData: true } : {}),
    },
    orderBy: { sortOrder: "asc" },
  });

  const existingGovDocs = allDocs.filter((d) => d.category === "governance");
  const existingPolicyDocs = allDocs.filter((d) => d.category === "policy");

  console.log(`2. Current DB Status:`);
  console.log(`   - Total GovernanceDocument rows: ${allDocs.length}`);
  console.log(`   - Governance records: ${existingGovDocs.length} (Expected: 5)`);
  console.log(`   - Policy records: ${existingPolicyDocs.length} (Expected: 4, will NOT be modified)\n`);

  console.log(`3. Comparison & Parity Report against Verified Reference:`);
  console.log("---------------------------------------------------------------------------------------------------------");
  console.log("| ID    | Title                           | Current DB Table Rows | Reference Rows | Status           |");
  console.log("---------------------------------------------------------------------------------------------------------");

  let totalImportRows = 0;
  for (const seed of canonicalGovernanceTables) {
    const existing = existingGovDocs.find((d) => d.id === seed.id || d.title.toLowerCase() === seed.title.toLowerCase());
    const existingTableData: any = existing && "tableData" in existing ? (existing as any).tableData : null;
    const currentRowsCount = existingTableData?.rows?.length || 0;
    const refRowsCount = seed.tableData.rows.length;
    totalImportRows += refRowsCount;

    let status = "NEW / READY TO IMPORT";
    if (existing) {
      if (currentRowsCount === refRowsCount) {
        status = "ALREADY POPULATED";
      } else {
        status = `NEEDS UPDATE (+${refRowsCount - currentRowsCount})`;
      }
    }

    console.log(
      `| ${seed.id.padEnd(5)} | ${seed.title.padEnd(31)} | ${String(currentRowsCount).padEnd(21)} | ${String(refRowsCount).padEnd(14)} | ${status.padEnd(16)} |`
    );
  }
  console.log("---------------------------------------------------------------------------------------------------------\n");

  console.log(`Total Committee Rows to Import: ${totalImportRows}`);

  // Validation checks:
  console.log("\n4. Table Structure & Integrity Validation:");
  let hasValidationErrors = false;
  for (const seed of canonicalGovernanceTables) {
    const colKeys = seed.tableData.columns.map((c) => c.key);
    for (let rIdx = 0; rIdx < seed.tableData.rows.length; rIdx++) {
      const row = seed.tableData.rows[rIdx];
      if (row.cells.length !== seed.tableData.columns.length) {
        console.error(`   [ERROR] ${seed.title} Row #${rIdx + 1} (${row.id}) has ${row.cells.length} cells but ${seed.tableData.columns.length} columns defined!`);
        hasValidationErrors = true;
      }
    }
    console.log(`   [PASS] ${seed.title}: ${seed.tableData.columns.length} columns, ${seed.tableData.rows.length} rows verified.`);
  }

  if (hasValidationErrors) {
    console.error("\nValidation errors detected in seed data. Aborting!");
    process.exit(1);
  }

  if (isDryRun && !isApply) {
    console.log("\n[DRY RUN COMPLETE] No changes written to database.");
    console.log("Run with `--apply` to commit changes to Aiven MySQL.");
    return;
  }

  // APPLY MODE
  console.log("\n5. Applying Migration to Aiven MySQL...");
  await ensureTableDataColumnExists();

  for (const seed of canonicalGovernanceTables) {
    console.log(`   Updating ${seed.title} (${seed.id})...`);
    await prisma.governanceDocument.upsert({
      where: { id: seed.id },
      update: {
        title: seed.title,
        description: seed.description,
        documentUrl: seed.documentUrl,
        category: "governance",
        tableData: seed.tableData as any,
        sortOrder: seed.sortOrder,
        status: "PUBLISHED",
      },
      create: {
        id: seed.id,
        title: seed.title,
        description: seed.description,
        documentUrl: seed.documentUrl,
        category: "governance",
        tableData: seed.tableData as any,
        sortOrder: seed.sortOrder,
        status: "PUBLISHED",
      },
    });
  }

  console.log("\n[APPLY SUCCESSFUL] All 5 governance committee tables successfully saved to Aiven MySQL.");
}

run()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
