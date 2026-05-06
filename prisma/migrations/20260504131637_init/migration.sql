-- CreateTable
CREATE TABLE `Logger` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `interval` INTEGER NOT NULL,
    `devices` BOOLEAN NOT NULL,
    `tags` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Logger_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoggerTagslist` (
    `id` VARCHAR(191) NOT NULL,
    `id_tags` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoggerDevices` (
    `id` VARCHAR(191) NOT NULL,
    `id_Mtcp` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LoggerTagslist` ADD CONSTRAINT `LoggerTagslist_id_tags_fkey` FOREIGN KEY (`id_tags`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoggerDevices` ADD CONSTRAINT `LoggerDevices_id_Mtcp_fkey` FOREIGN KEY (`id_Mtcp`) REFERENCES `Mtcplist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
