# Database Least-Privilege & Access Control Specification

**Document Version:** 1.0.0  
**Target Environment:** Aiven Cloud MySQL 8.0+ / Production Database (`defaultdb`)  
**Security Baseline:** Principle of Least Privilege (PoLP), Mandatory TLS v1.2+, Zero DDL at Runtime  

---

## 1. Architecture & Account Separation

To prevent privilege escalation, destructive accidental operations, and catastrophic SQL injection consequences, database access is segregated into two strictly isolated roles:

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│     Next.js Runtime Web App     │           │      CI/CD Migration Runner     │
│   (Server Actions, APIs, CMS)   │           │      (Prisma CLI Deployments)   │
└────────────────┬────────────────┘           └────────────────┬────────────────┘
                 │                                             │
                 │ DML Only (SELECT, INSERT, UPDATE, DELETE)   │ DDL + DML (MIGRATIONS ONLY)
                 ▼                                             ▼
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│    Account: `geeta_app`@`%`     │           │   Account: `geeta_migrator`     │
│       TLS Required: YES         │           │       TLS Required: YES         │
└────────────────┬────────────────┘           └────────────────┬────────────────┘
                 │                                             │
                 └───────────────────────┬─────────────────────┘
                                         ▼
                 ┌─────────────────────────────────────────────┐
                 │       Aiven Cloud MySQL (`defaultdb`)       │
                 └─────────────────────────────────────────────┘
```

---

## 2. Permission Matrix

| Capability | Runtime Account (`geeta_app`) | Migration Account (`geeta_migrator` / `avnadmin`) | Rationale |
| :--- | :---: | :---: | :--- |
| **SELECT** | **ALLOWED** | **ALLOWED** | Public route data fetching, admin authentication, CMS reads |
| **INSERT** | **ALLOWED** | **ALLOWED** | Creating pages, media uploads, news, leads, admin audit logs |
| **UPDATE** | **ALLOWED** | **ALLOWED** | Editing content, publishing pages, updating credentials |
| **DELETE** | **ALLOWED** | **ALLOWED** | Removing drafts, purging expired sessions, deleting entries |
| **CREATE TABLE / VIEW** | **DENIED** | **ALLOWED** | Schema definition must occur via controlled migrations |
| **ALTER TABLE** | **DENIED** | **ALLOWED** | Prevents runtime schema tampering or destructive mutations |
| **DROP TABLE / DATABASE** | **DENIED** | **ALLOWED** (Isolated) | Mitigates data loss from application vulnerabilities |
| **TRUNCATE** | **DENIED** | **DENIED** | Unlogged mass deletion blocked |
| **GRANT OPTION / SUPER** | **DENIED** | **DENIED** | Privilege escalation strictly prevented |

---

## 3. Implementation Script

The exact provisioning script is maintained in [`prisma/least-privilege-grants.sql`](file:///Users/suryansh/Desktop/GU/Geeta-University/prisma/least-privilege-grants.sql):

```sql
-- 1. Create Dedicated Runtime Application User
CREATE USER IF NOT EXISTS 'geeta_app'@'%' 
  IDENTIFIED WITH caching_sha2_password BY 'APPLICATION_SECRET_PASSPHRASE';

-- 2. Enforce Mandatory TLS
ALTER USER 'geeta_app'@'%' REQUIRE SSL;

-- 3. Revoke Global Privileges
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'geeta_app'@'%';

-- 4. Grant Runtime DML on Target Schema
GRANT SELECT, INSERT, UPDATE, DELETE ON `defaultdb`.* TO 'geeta_app'@'%';

-- 5. Dedicated Migration Account
CREATE USER IF NOT EXISTS 'geeta_migrator'@'%' 
  IDENTIFIED WITH caching_sha2_password BY 'MIGRATOR_SECRET_PASSPHRASE';
ALTER USER 'geeta_migrator'@'%' REQUIRE SSL;
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'geeta_migrator'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, REFERENCES, INDEX, CREATE VIEW, SHOW VIEW, TRIGGER 
  ON `defaultdb`.* TO 'geeta_migrator'@'%';

FLUSH PRIVILEGES;
```

---

## 4. Connection Configuration & TLS Parameters

### Runtime Connection String (`.env`):
```ini
DATABASE_URL="mysql://geeta_app:<APP_PASSWORD>@<AIVEN_HOST>:<PORT>/defaultdb?sslcert=ca.pem"
```

### Driver TLS Enforcement (`src/server/db/client.ts`):
```typescript
const pool = mariadb.createPool({
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.replace(/^\//, ""),
  ssl: {
    ca: caCert,
    rejectUnauthorized: true, // Strict certificate validation
  },
  connectionLimit: 10,
});
```

---

## 5. Deployment & Rollback Plan

### Migration to Least-Privilege Account:
1. Run `prisma/least-privilege-grants.sql` against the staging/production database using administrative account (`avnadmin`).
2. Test connection from staging environment:
   ```bash
   npx tsx -r ./scripts/mock-server-only.js scripts/phase4_phase5_test_suite.ts
   ```
3. Verify runtime account cannot execute DDL by attempting a dummy table creation (must return `ER_TABLEACCESS_DENIED_ERROR`).
4. Update application production environment secret `DATABASE_URL` with `geeta_app` credentials.
5. Deploy application.

### Rollback Procedure:
If unexpected runtime queries fail due to missing grants:
1. Immediately switch `DATABASE_URL` back to the existing administrative credentials (`avnadmin`).
2. Restart the application container.
3. Review MySQL general query log to identify ungranted operations, review security implications, and adjust `least-privilege-grants.sql` accordingly before re-applying.
