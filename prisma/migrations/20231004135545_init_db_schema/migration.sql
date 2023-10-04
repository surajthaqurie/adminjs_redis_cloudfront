-- CreateEnum
CREATE TYPE "OG_TYPE" AS ENUM ('WEBSITE', 'MOBILE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'SEO');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" JSONB,
    "image_alternative_text" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "og_title" TEXT,
    "og_description" TEXT,
    "og_url" TEXT,
    "og_type" "OG_TYPE",
    "keywords" TEXT,
    "canonical_link" TEXT,
    "sections" JSONB,
    "meta_box" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Games" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" JSONB,
    "image_alternative_text" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "orders" INTEGER,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "og_title" TEXT,
    "og_description" TEXT,
    "og_url" TEXT,
    "og_type" "OG_TYPE",
    "keywords" TEXT,
    "canonical_link" TEXT,
    "gallery" JSONB,
    "gallery_alternative_text" TEXT NOT NULL,
    "youtube_link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "game_type" TEXT NOT NULL,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameTypes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" JSONB,
    "image_alternative_text" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "orders" INTEGER,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "og_title" TEXT,
    "og_description" TEXT,
    "og_url" TEXT,
    "og_type" "OG_TYPE",
    "keywords" TEXT,
    "cannonical_link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameByCategory" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameByCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pages_id_key" ON "Pages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Pages_slug_key" ON "Pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Games_id_key" ON "Games"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Games_slug_key" ON "Games"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GameTypes_id_key" ON "GameTypes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GameTypes_slug_key" ON "GameTypes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GameCategory_id_key" ON "GameCategory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GameCategory_slug_key" ON "GameCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GameByCategory_id_key" ON "GameByCategory"("id");

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "session"("expire");

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_game_type_fkey" FOREIGN KEY ("game_type") REFERENCES "GameTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameByCategory" ADD CONSTRAINT "GameByCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GameCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameByCategory" ADD CONSTRAINT "GameByCategory_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
