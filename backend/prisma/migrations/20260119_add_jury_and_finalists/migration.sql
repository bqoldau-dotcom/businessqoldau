-- CreateTable: jury_members
CREATE TABLE "jury_members" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "organization" TEXT,
    "photo_path" TEXT,
    "bio" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jury_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable: finalists
CREATE TABLE "finalists" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "category" "ApplicationCategory" NOT NULL,
    "city" TEXT,
    "photo_path" TEXT,
    "description" TEXT,
    "place" INTEGER,
    "is_winner" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finalists_pkey" PRIMARY KEY ("id")
);
