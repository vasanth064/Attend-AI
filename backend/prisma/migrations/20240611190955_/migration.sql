-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_inviteId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "inviteId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_inviteId_fkey" FOREIGN KEY ("inviteId") REFERENCES "InviteConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
