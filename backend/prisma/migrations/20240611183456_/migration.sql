/*
  Warnings:

  - Added the required column `inviteId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AttendanceLogs" DROP CONSTRAINT "AttendanceLogs_enrollmentID_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_SessionID_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_userID_fkey";

-- DropForeignKey
ALTER TABLE "InviteConfig" DROP CONSTRAINT "InviteConfig_clientID_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_clientID_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clientID_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "inviteId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "InviteConfig" ADD CONSTRAINT "InviteConfig_clientID_fkey" FOREIGN KEY ("clientID") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_SessionID_fkey" FOREIGN KEY ("SessionID") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_inviteId_fkey" FOREIGN KEY ("inviteId") REFERENCES "InviteConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clientID_fkey" FOREIGN KEY ("clientID") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_clientID_fkey" FOREIGN KEY ("clientID") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceLogs" ADD CONSTRAINT "AttendanceLogs_enrollmentID_fkey" FOREIGN KEY ("enrollmentID") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
