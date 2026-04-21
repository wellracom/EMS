/*
  Warnings:

  - You are about to drop the column `defautWB` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `defautWB`,
    ADD COLUMN `defaultWB` VARCHAR(191) NULL;
