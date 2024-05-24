/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ENABLED', 'DISABLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserType" ADD VALUE 'CLIENT';
ALTER TYPE "UserType" ADD VALUE 'MACHINE';

-- AlterTable
CREATE SEQUENCE attendancelogs_id_seq;
ALTER TABLE "AttendanceLogs" ALTER COLUMN "id" SET DEFAULT nextval('attendancelogs_id_seq');
ALTER SEQUENCE attendancelogs_id_seq OWNED BY "AttendanceLogs"."id";

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
CREATE SEQUENCE session_id_seq;
ALTER TABLE "Session" ALTER COLUMN "id" SET DEFAULT nextval('session_id_seq');
ALTER SEQUENCE session_id_seq OWNED BY "Session"."id";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ENABLED';

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
