-- AlterTable
ALTER TABLE "contacts" ADD COLUMN "replied_at" TIMESTAMP(3),
ADD COLUMN "replied_by_id" UUID;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_replied_by_id_fkey" FOREIGN KEY ("replied_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
