-- =========================================================================
-- MIGRATION DRAFT (NOT EXECUTED - READY FOR PRODUCTION DEPLOYMENT REVIEW)
-- Migration: 20261101_add_cms_section_visibility
-- Target Engine: MySQL 8.0+ (Hostinger Production)
-- Description: Additive table for centralized CMS section visibility
-- =========================================================================

CREATE TABLE IF NOT EXISTS `CmsSectionVisibility` (
  `id` VARCHAR(191) NOT NULL,
  `scopeType` VARCHAR(64) NOT NULL,
  `scopeId` VARCHAR(191) NOT NULL,
  `sectionKey` VARCHAR(128) NOT NULL,
  `isVisible` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  INDEX `CmsSectionVisibility_scopeType_scopeId_idx`(`scopeType`, `scopeId`),
  UNIQUE INDEX `CmsSectionVisibility_scopeType_scopeId_sectionKey_key`(`scopeType`, `scopeId`, `sectionKey`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
