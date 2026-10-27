# Aiven MySQL Database Backup, Restore & Disaster Recovery Runbook

**Document Version:** 1.0.0  
**Target Platform:** Aiven Cloud MySQL 8.0+  
**Application:** Geeta University Public Web Portal & Database-Backed CMS  
**Security Classification:** Highly Confidential  

---

## 1. Disaster Recovery & Backup Architecture

Geeta University employs a multi-tiered backup and recovery strategy combining Aiven automated infrastructure backups with automated logical dumps:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   AIVEN MANAGED PLATFORM BACKUPS                      │
│                                                                        │
│  - Automated Full Snapshots: Daily at 02:00 UTC                        │
│  - Continuous Binary Logging: Point-In-Time-Recovery (PITR) to second  │
│  - Retention: 14 to 30 days retention policy                          │
│  - Offsite Geographic Redundancy                                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                  AUTOMATED LOGICAL OPERATIONAL DUMPS                   │
│                                                                        │
│  - Script: scripts/ops/backup-db.sh                                    │
│  - Encryption: TLS in-transit via Aiven CA (ca.pem)                   │
│  - Consistency: --single-transaction (Zero-downtime InnoDB snapshot)   │
│  - Integrity: SHA-256 cryptographic checksum calculation               │
│  - Compression: gzip (.sql.gz)                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Point-In-Time Recovery (PITR) via Aiven Console / CLI

Aiven Cloud MySQL continuously streams binary logs. In the event of catastrophic data corruption, accidental drop, or ransomware:

### Option A: Via Aiven Web Console
1. Log in to [https://console.aiven.io](https://console.aiven.io).
2. Navigate to the MySQL service (`mysql-geeta-prod`).
3. Click the **Actions** dropdown > **Fork Service** or **Restore from Backup**.
4. Select **Point-in-Time Recovery**.
5. Specify the exact timestamp (UTC) immediately preceding the incident (e.g., `2026-10-26 14:15:00 UTC`).
6. Name the new restored instance (e.g., `mysql-geeta-recovery-test`).
7. Verify table contents and consistency on the restored instance before repointing application DNS or secrets.

### Option B: Via Aiven CLI (`avn`)
```bash
avn service create mysql-geeta-recovery \
  --service-type mysql \
  --plan startup-4 \
  -c service_to_fork_from=mysql-geeta-prod \
  -c recovery_target_time="2026-10-26T14:15:00Z"
```

---

## 3. Logical Dump Execution (`scripts/ops/backup-db.sh`)

For pre-migration snapshots, staging replication, and off-cloud archives:

### Prerequisites:
- `mysql-client` (`mysqldump`) installed.
- Root CA certificate available at `ca.pem` or `prisma/ca.pem`.
- Environment variable `DATABASE_URL` configured.

### Execution:
```bash
./scripts/ops/backup-db.sh
```

### Script Execution Guarantees:
- Runs `mysqldump` with `--single-transaction` to guarantee transactional consistency across all InnoDB tables without locking active CMS operations.
- Enforces `--ssl-ca=ca.pem` to prevent man-in-the-middle sniffing of database dumps.
- Streams directly through `gzip` to minimize disk footprint.
- Automatically generates a `.sha256` checksum file for post-transfer integrity validation.

---

## 4. Isolated Restore Procedure (`scripts/ops/restore-db.sh`)

> [!CAUTION]
> **Safety Guard:** The restore script strictly blocks execution if the target database name is identical to production (`defaultdb` or `geeta_university`), unless `--force-prod-override` is explicitly passed. Always restore into an isolated staging database (e.g., `geeta_recovery_test`).

### Step-by-Step Isolated Restore Test:
1. Verify the integrity of the backup file:
   ```bash
   sha256sum -c backups/mysql_geeta_backup_YYYYMMDD_HHMMSS.sql.gz.sha256
   ```
2. Create an isolated database on MySQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS geeta_recovery_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Run the automated restore script:
   ```bash
   TARGET_DB="geeta_recovery_test" ./scripts/ops/restore-db.sh backups/mysql_geeta_backup_YYYYMMDD_HHMMSS.sql.gz
   ```
4. Run application verification tests against the restored isolated database:
   ```bash
   DATABASE_URL="mysql://avnadmin:<PASSWORD>@<AIVEN_HOST>:<PORT>/geeta_recovery_test?sslcert=ca.pem" \
     npx tsx -r ./scripts/mock-server-only.js scripts/phase4_phase5_test_suite.ts
   ```
5. Confirm row counts for critical tables:
   ```sql
   SELECT 'pages' AS tbl, count(*) FROM geeta_recovery_test.pages
   UNION ALL
   SELECT 'admin_users', count(*) FROM geeta_recovery_test.admin_users
   UNION ALL
   SELECT 'news_articles', count(*) FROM geeta_recovery_test.news_articles;
   ```

---

## 5. Backward-Compatible Migration & Application Rollback Runbook

### Pre-Deployment Checklist:
1. Execute `./scripts/ops/backup-db.sh` immediately before running any Prisma migration.
2. Ensure migrations only contain additive, backward-compatible schema changes (e.g., adding nullable columns, adding new tables). Never drop or rename columns in the same deployment as the application code change.
3. Test migration on staging:
   ```bash
   npx prisma migrate deploy
   ```

### Rollback Strategy:
If an application deployment fails after migration:
1. **Application Rollback:** Re-deploy the previous container / git commit hash on Hostinger/Vercel.
2. **Database Schema State:** Because migrations follow the Expand/Contract (Additive) pattern, the older application code will continue to function seamlessly on the newly added schema columns.
3. **Emergency Schema Rollback:** If a migration must be reverted, generate a down-migration script using Prisma CLI or apply the inverse DDL manually via `avnadmin`.
