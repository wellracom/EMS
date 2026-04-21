/*
  Warnings:

  - You are about to drop the column `defaultWB` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `defaultWB`,
    ADD COLUMN `email` VARCHAR(191) NULL;
