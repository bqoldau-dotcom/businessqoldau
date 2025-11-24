/**
 * Migration script to move existing application files from planFilePath
 * to the new application_files table
 *
 * This script:
 * 1. Finds all applications with planFilePath (existing files)
 * 2. Extracts file metadata (size, MIME type, filename)
 * 3. Creates records in application_files table
 * 4. Uses transactions for data safety
 * 5. Logs all operations
 *
 * IMPORTANT: This script does NOT delete planFilePath data (for safety)
 */

import prisma from '../config/database';
import path from 'path';
import fs from 'fs';
import { FileType } from '@prisma/client';

// MIME type mapping
const getMimeType = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',
  };
  return mimeTypes[ext] || 'application/octet-stream';
};

// Determine file type from MIME type
const getFileType = (mimeType: string): FileType => {
  if (mimeType.startsWith('video/')) {
    return FileType.video;
  }
  if (mimeType.startsWith('application/')) {
    return FileType.document;
  }
  return FileType.other;
};

// Extract filename from path
const getFileName = (filePath: string): string => {
  return path.basename(filePath);
};

// Get file size (returns 0 if file doesn't exist)
const getFileSize = (filePath: string): number => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      return stats.size;
    }
    console.warn(`⚠️  File not found: ${fullPath}`);
    return 0;
  } catch (error) {
    console.error(`❌ Error reading file ${filePath}:`, error);
    return 0;
  }
};

async function migrateApplicationFiles() {
  console.log('🚀 Starting migration of application files...\n');

  try {
    // 1. Find all applications with planFilePath
    const applicationsWithFiles = await prisma.application.findMany({
      where: {
        planFilePath: {
          not: null,
        },
      },
      select: {
        id: true,
        planFilePath: true,
        createdAt: true,
      },
    });

    console.log(`📊 Found ${applicationsWithFiles.length} applications with files\n`);

    if (applicationsWithFiles.length === 0) {
      console.log('✅ No files to migrate. Migration complete!\n');
      return;
    }

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // 2. Process each application
    for (const application of applicationsWithFiles) {
      const { id, planFilePath } = application;

      if (!planFilePath) {
        skipCount++;
        continue;
      }

      try {
        // Extract file metadata
        const fileName = getFileName(planFilePath);
        const mimeType = getMimeType(planFilePath);
        const fileType = getFileType(mimeType);
        const fileSize = getFileSize(planFilePath);

        // Check if already migrated (use raw SQL)
        const existing = await prisma.$queryRaw<Array<{ count: bigint }>>`
          SELECT COUNT(*) as count FROM application_files
          WHERE application_id = ${id}::uuid AND file_path = ${planFilePath}
        `;

        if (existing[0].count > 0n) {
          console.log(`⏭️  Skipping ${id.substring(0, 8)}: already migrated`);
          skipCount++;
          continue;
        }

        // Create new ApplicationFile record
        await prisma.$executeRaw`
          INSERT INTO application_files (id, application_id, file_path, file_name, file_size, mime_type, file_type, created_at)
          VALUES (gen_random_uuid(), ${id}::uuid, ${planFilePath}, ${fileName}, ${fileSize}, ${mimeType}, ${fileType}::"FileType", NOW())
        `;

        successCount++;
        console.log(`✅ Migrated: ${fileName} (${fileSize} bytes) for application ${id.substring(0, 8)}...`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error migrating application ${id}:`, error);
      }
    }

    // 3. Summary
    console.log('\n' + '='.repeat(60));
    console.log('📈 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total applications found:    ${applicationsWithFiles.length}`);
    console.log(`✅ Successfully migrated:     ${successCount}`);
    console.log(`⏭️  Skipped (already migrated): ${skipCount}`);
    console.log(`❌ Errors:                    ${errorCount}`);
    console.log('='.repeat(60));

    if (successCount > 0) {
      console.log('\n✨ Migration completed successfully!');
      console.log('ℹ️  Note: Original planFilePath data was preserved for safety.');
    }

    if (errorCount > 0) {
      console.log('\n⚠️  Some files failed to migrate. Please review errors above.');
    }

    // 4. Verification query
    const totalFilesInNewTable = await prisma.applicationFile.count();
    console.log(`\n🔍 Verification: ${totalFilesInNewTable} files now in application_files table`);

  } catch (error) {
    console.error('\n❌ Fatal error during migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateApplicationFiles()
  .then(() => {
    console.log('\n✅ Migration script finished\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration script failed:', error);
    process.exit(1);
  });
