#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# GEETA UNIVERSITY - AIVEN MYSQL SECURE RESTORE SCRIPT
# ==============================================================================
# Usage:
#   ./scripts/ops/restore-db.sh <backup_file.sql.gz> [target_database_name]
#
# Requirements:
#   - mysql client, gunzip, sha256sum (or shasum)
#   - DATABASE_URL in environment or .env
#   - prisma/ca.pem or ca.pem for TLS verification
# ==============================================================================

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <path_to_backup.sql.gz> [optional_target_database_name]" >&2
  exit 1
fi

BACKUP_FILE="$1"
TARGET_DB="${2:-}"

if [[ ! -f "${BACKUP_FILE}" ]]; then
  echo "[-] ERROR: Backup file not found: ${BACKUP_FILE}" >&2
  exit 1
fi

# Verify checksum if present
CHECKSUM_FILE="${BACKUP_FILE}.sha256"
if [[ -f "${CHECKSUM_FILE}" ]]; then
  echo "[+] Verifying SHA-256 backup checksum..."
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum -c "${CHECKSUM_FILE}"
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 -c "${CHECKSUM_FILE}"
  fi
  echo "[✓] Checksum verified."
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Load DATABASE_URL from .env if unset
if [[ -z "${DATABASE_URL:-}" && -f "${PROJECT_ROOT}/.env" ]]; then
  DATABASE_URL="$(grep -E '^DATABASE_URL=' "${PROJECT_ROOT}/.env" | cut -d'=' -f2- | tr -d '"')"
fi

# Locate CA certificate
CA_PATH=""
if [[ -f "${PROJECT_ROOT}/prisma/ca.pem" ]]; then
  CA_PATH="${PROJECT_ROOT}/prisma/ca.pem"
elif [[ -f "${PROJECT_ROOT}/ca.pem" ]]; then
  CA_PATH="${PROJECT_ROOT}/ca.pem"
fi

echo "[!] Restoring database from: ${BACKUP_FILE}"

node -e "
const { execSync } = require('child_process');
const fs = require('fs');

const rawUrl = process.env.DATABASE_URL;
const u = new URL(rawUrl);
const host = u.hostname;
const port = u.port || '3306';
const user = decodeURIComponent(u.username);
const pass = decodeURIComponent(u.password);
const defaultDb = u.pathname.slice(1);
const targetDb = '${TARGET_DB}' || defaultDb;
const ca = '${CA_PATH}';
const backupPath = '${BACKUP_FILE}';

const sslFlag = ca ? \`--ssl-ca=\${ca} --ssl-verify-server-cert\` : '--ssl';
const restoreCmd = \`gunzip -c \${backupPath} | mysql -h \${host} -P \${port} -u \${user} --password=\${pass} \${sslFlag} \${targetDb}\`;

console.log(\`[+] Target Database: \${targetDb} on \${host}:\${port}\`);
try {
  execSync(restoreCmd, { stdio: 'inherit' });
  console.log('[✓] Database restore successfully executed.');
} catch (err) {
  console.error('[-] mysql restore failed:', err.message);
  process.exit(1);
}
"
