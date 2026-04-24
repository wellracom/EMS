/*
  Warnings:

  - You are about to drop the column `hight` on the `tag` table. All the data in the column will be lost.
  - You are about to drop the column `highthight` on the `tag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tag` DROP COLUMN `hight`,
    DROP COLUMN `highthight`,
    ADD COLUMN `high` DECIMAL(10, 3) NULL,
    ADD COLUMN `highhigh` DECIMAL(10, 3) NULL;
