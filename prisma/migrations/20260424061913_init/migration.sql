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
CREATE TABLE `mtcplist` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `port` INTEGER NOT NULL,
    `unitId` INTEGER NOT NULL,
    `timeout` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `mtcplist_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mtcpaddress` (
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
CREATE TABLE `tag` (
    `id` VARCHAR(191) NOT NULL,
    `mtcpaddressId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `offset` DECIMAL(10, 3) NULL,
    `gain` DECIMAL(10, 3) NULL,
    `unit` VARCHAR(191) NULL,
    `lowlow` DECIMAL(10, 3) NULL,
    `low` DECIMAL(10, 3) NULL,
    `hight` DECIMAL(10, 3) NULL,
    `highthight` DECIMAL(10, 3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mtcpaddress` ADD CONSTRAINT `mtcpaddress_mtcpId_fkey` FOREIGN KEY (`mtcpId`) REFERENCES `mtcplist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tag` ADD CONSTRAINT `tag_mtcpaddressId_fkey` FOREIGN KEY (`mtcpaddressId`) REFERENCES `mtcpaddress`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
