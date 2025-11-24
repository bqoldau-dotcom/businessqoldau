-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('document', 'video', 'other');

-- CreateTable
CREATE TABLE "application_files" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_type" "FileType" NOT NULL DEFAULT 'document',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "application_files_application_id_idx" ON "application_files"("application_id");

-- AddForeignKey
ALTER TABLE "application_files" ADD CONSTRAINT "application_files_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
