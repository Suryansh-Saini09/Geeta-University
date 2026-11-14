-- ==============================================================================
-- GEETA UNIVERSITY DATABASE LEAST PRIVILEGE CONFIGURATION
-- Database: MySQL 8.0+ / Aiven Cloud MySQL
-- ==============================================================================

-- 1. Create Dedicated Runtime Application User
-- Replace 'STRONG_APPLICATION_PASSWORD_HERE' with a cryptographically generated 32+ char password.
CREATE USER IF NOT EXISTS 'geeta_app'@'%' IDENTIFIED WITH caching_sha2_password BY 'STRONG_APPLICATION_PASSWORD_HERE';

-- 2. Enforce Mandatory TLS / Encrypted Transport for Runtime Account
ALTER USER 'geeta_app'@'%' REQUIRE SSL;

-- 3. Revoke Any Inherited Global Privileges
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'geeta_app'@'%';

-- 4. Grant Least-Privilege DML Permissions on Application Schema
-- The web application runtime only requires Data Manipulation Language (DML) rights.
-- It MUST NOT have DDL (CREATE, ALTER, DROP, TRUNCATE) or Administrative rights.
GRANT SELECT, INSERT, UPDATE, DELETE ON `defaultdb`.* TO 'geeta_app'@'%';

-- 5. Lock Down Sensitive Operations
-- geeta_app CANNOT execute:
-- - DROP TABLE, ALTER TABLE, CREATE TABLE (DDL is restricted to migration administrator)
-- - CREATE USER, GRANT OPTION (Privilege escalation prevention)
-- - FILE, PROCESS, SUPER, SHUTDOWN (Server administrative lockdowns)

-- 6. Dedicated Migration Account (For Prisma CLI / CI/CD Pipeline Only)
CREATE USER IF NOT EXISTS 'geeta_migrator'@'%' IDENTIFIED WITH caching_sha2_password BY 'STRONG_MIGRATOR_PASSWORD_HERE';
ALTER USER 'geeta_migrator'@'%' REQUIRE SSL;
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'geeta_migrator'@'%';

-- Migration account receives DDL and DML on the application database schema only
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, REFERENCES, INDEX, CREATE VIEW, SHOW VIEW, TRIGGER 
ON `defaultdb`.* TO 'geeta_migrator'@'%';

-- 7. Flush Privileges to Apply Changes Immediately
FLUSH PRIVILEGES;

-- ==============================================================================
-- VERIFICATION QUERIES (Run to verify grant boundaries)
-- ==============================================================================
-- SHOW GRANTS FOR 'geeta_app'@'%';
-- SHOW GRANTS FOR 'geeta_migrator'@'%';
