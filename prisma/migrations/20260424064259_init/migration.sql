-- DropForeignKey
ALTER TABLE `mtcpaddress` DROP FOREIGN KEY `mtcpaddress_mtcpId_fkey`;

-- DropForeignKey
ALTER TABLE `tag` DROP FOREIGN KEY `tag_mtcpaddressId_fkey`;

-- AddForeignKey
ALTER TABLE `Mtcpaddress` ADD CONSTRAINT `Mtcpaddress_mtcpId_fkey` FOREIGN KEY (`mtcpId`) REFERENCES `Mtcplist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tag` ADD CONSTRAINT `Tag_mtcpaddressId_fkey` FOREIGN KEY (`mtcpaddressId`) REFERENCES `Mtcpaddress`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `mtcplist` RENAME INDEX `mtcplist_name_key` TO `Mtcplist_name_key`;

-- RenameIndex
ALTER TABLE `tag` RENAME INDEX `tag_name_key` TO `Tag_name_key`;
