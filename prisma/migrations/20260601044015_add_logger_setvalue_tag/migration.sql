-- CreateTable
CREATE TABLE `LoggerSetTag` (
    `id` VARCHAR(191) NOT NULL,
    `id_tags` VARCHAR(191) NOT NULL,
    `id_user` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LoggerSetTag` ADD CONSTRAINT `LoggerSetTag_id_tags_fkey` FOREIGN KEY (`id_tags`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoggerSetTag` ADD CONSTRAINT `LoggerSetTag_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
