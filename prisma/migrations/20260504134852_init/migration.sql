/*
  Warnings:

  - You are about to drop the `loggerdevices` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_Logger` to the `LoggerTagslist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `loggerdevices` DROP FOREIGN KEY `LoggerDevices_id_Mtcp_fkey`;

-- AlterTable
ALTER TABLE `loggertagslist` ADD COLUMN `id_Logger` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `loggerdevices`;

-- CreateTable
CREATE TABLE `LoggerDeviceslist` (
    `id` VARCHAR(191) NOT NULL,
    `id_Logger` VARCHAR(191) NOT NULL,
    `id_Mtcp` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LoggerTagslist` ADD CONSTRAINT `LoggerTagslist_id_Logger_fkey` FOREIGN KEY (`id_Logger`) REFERENCES `Logger`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoggerDeviceslist` ADD CONSTRAINT `LoggerDeviceslist_id_Logger_fkey` FOREIGN KEY (`id_Logger`) REFERENCES `Logger`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoggerDeviceslist` ADD CONSTRAINT `LoggerDeviceslist_id_Mtcp_fkey` FOREIGN KEY (`id_Mtcp`) REFERENCES `Mtcplist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
