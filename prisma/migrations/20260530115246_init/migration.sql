-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'operator', 'supervisor', 'maintanace') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RefreshToken_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mtcplist` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `port` INTEGER NOT NULL,
    `unitId` INTEGER NOT NULL,
    `timeout` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Mtcplist_name_key`(`name`),
    UNIQUE INDEX `Mtcplist_ip_port_unitId_key`(`ip`, `port`, `unitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mtcpaddress` (
    `id` VARCHAR(191) NOT NULL,
    `mtcpId` VARCHAR(191) NOT NULL,
    `address` INTEGER NOT NULL,
    `functioncode` ENUM('FC1', 'FC2', 'FC3', 'FC4') NOT NULL,
    `typedata` ENUM('INT16_SIGNED', 'INT16_UNSIGNED', 'INT32_BIG_ENDIAN', 'INT32_LITTLE_ENDIAN', 'FLOAT32_ABCD', 'FLOAT32_BADC', 'FLOAT32_CDAB', 'FLOAT32_DCBA', 'DOUBLE64', 'BOOLEAN', 'ASCII', 'BCD') NOT NULL,
    `canread` BOOLEAN NOT NULL,
    `canwrite` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` VARCHAR(191) NOT NULL,
    `mtcpaddressId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `offset` DECIMAL(10, 3) NULL,
    `gain` DECIMAL(10, 3) NULL,
    `unit` VARCHAR(191) NULL,
    `lowlow` DECIMAL(10, 3) NULL,
    `low` DECIMAL(10, 3) NULL,
    `high` DECIMAL(10, 3) NULL,
    `highhigh` DECIMAL(10, 3) NULL,
    `booltruestate` VARCHAR(191) NULL,
    `boolfalsestate` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dashboard` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `itshare` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Widget` (
    `id` VARCHAR(191) NOT NULL,
    `dashboardId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `w` INTEGER NOT NULL,
    `h` INTEGER NOT NULL,
    `config` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `id_Logger` VARCHAR(191) NOT NULL,
    `id_tags` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mtcpaddress` ADD CONSTRAINT `Mtcpaddress_mtcpId_fkey` FOREIGN KEY (`mtcpId`) REFERENCES `Mtcplist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tag` ADD CONSTRAINT `Tag_mtcpaddressId_fkey` FOREIGN KEY (`mtcpaddressId`) REFERENCES `Mtcpaddress`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Widget` ADD CONSTRAINT `Widget_dashboardId_fkey` FOREIGN KEY (`dashboardId`) REFERENCES `Dashboard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoggerTagslist` ADD CONSTRAINT `LoggerTagslist_id_Logger_fkey` FOREIGN KEY (`id_Logger`) REFERENCES `Logger`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoggerTagslist` ADD CONSTRAINT `LoggerTagslist_id_tags_fkey` FOREIGN KEY (`id_tags`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoggerDeviceslist` ADD CONSTRAINT `LoggerDeviceslist_id_Logger_fkey` FOREIGN KEY (`id_Logger`) REFERENCES `Logger`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoggerDeviceslist` ADD CONSTRAINT `LoggerDeviceslist_id_Mtcp_fkey` FOREIGN KEY (`id_Mtcp`) REFERENCES `Mtcplist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
