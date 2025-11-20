-- CreateTable
CREATE TABLE "public"."application_settings" (
    "id" UUID NOT NULL,
    "setting_key" TEXT NOT NULL,
    "setting_value" JSONB NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_settings_setting_key_key" ON "public"."application_settings"("setting_key");

-- AddForeignKey
ALTER TABLE "public"."application_settings" ADD CONSTRAINT "application_settings_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
