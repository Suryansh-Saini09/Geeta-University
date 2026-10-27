#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# GEETA UNIVERSITY - AIVEN MYSQL SECURE BACKUP SCRIPT
# ==============================================================================
# Usage:
#   ./scripts/ops/backup-db.sh [backup_dir]
#
# Requirements:
#   - mysqldump, gzip, sha256sum (or shasum)
#   - DATABASE_URL in environment or .env
#   - prisma/ca.pem or ca.pem for TLS verification
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BACKUP_DIR="${1:-${PROJECT_ROOT}/backups/mysql}"
TIMESTAMP="$(date +'%Y%m%d_%H%M%S')"
BACKUP_FILE="${BACKUP_DIR}/gu_mysql_backup_${TIMESTAMP}.sql.gz"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"

mkdir -p "${BACKUP_DIR}"

# Load DATABASE_URL from .env if unset
if [[ -z "${DATABASE_URL:-}" && -f "${PROJECT_ROOT}/.env" ]]; then
  DATABASE_URL="$(grep -E '^DATABASE_URL=' "${PROJECT_ROOT}/.env" | cut -d'=' -f2- | tr -d '"')"
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "[-] ERROR: DATABASE_URL is not set." >&2
  exit 1
fi

# Locate CA certificate
CA_PATH=""
if [[ -f "${PROJECT_ROOT}/prisma/ca.pem" ]]; then
  CA_PATH="${PROJECT_ROOT}/prisma/ca.pem"
elif [[ -f "${PROJECT_ROOT}/ca.pem" ]]; then
  CA_PATH="${PROJECT_ROOT}/ca.pem"
fi

echo "[+] Initiating secure database backup to: ${BACKUP_FILE}"

# Execute mysqldump via node helper to avoid parsing URL in pure bash
node -e "
const { execSync } = require('child_process');
const fs = require('fs');

const rawUrl = process.env.DATABASE_URL;
const u = new URL(rawUrl);
const host = u.hostname;
const port = u.port || '3306';
const user = decodeURIComponent(u.username);
const pass = decodeURIComponent(u.password);
const db = u.pathname.slice(1);
const ca = '${CA_PATH}';
const dest = '${BACKUP_FILE}';

const sslFlag = ca ? \`--ssl-ca=\${ca} --ssl-verify-server-cert\` : '--ssl';
const dumpCmd = \`mysqldump -h \${host} -P \${port} -u \${user} --password=\${pass} \${sslFlag} --single-transaction --quick --routines --triggers \${db} | gzip > \${dest}\`;

try {
  execSync(dumpCmd, { stdio: 'inherit' });
  console.log('[+] Backup dump created successfully.');
} catch (err) {
  console.error('[-] mysqldump failed:', err.message);
  process.exit(1);
}
"

# Generate SHA-256 checksum for backup integrity verification
if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "${BACKUP_FILE}" > "${CHECKSUM_FILE}"
elif command -v shasum >/dev/null 2>&1; then
  shasum -a 256 "${BACKUP_FILE}" > "${CHECKSUM_FILE}"
fi

echo "[+] Integrity Checksum generated at: ${CHECKSUM_FILE}"
ls -lh "${BACKUP_FILE}" "${CHECKSUM_FILE}"
echo "[✓] Backup operation completed successfully."
