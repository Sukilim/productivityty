/*
  Warnings:

  - You are about to drop the column `assigneeId` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `assignee` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assigneeId_fkey";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "assigneeId",
ADD COLUMN     "assignee" TEXT NOT NULL;

-- DropTable
DROP TABLE "users";
