/*
  Warnings:

  - A unique constraint covering the columns `[ip,port,unitId]` on the table `Mtcplist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Mtcplist_ip_port_unitId_key` ON `Mtcplist`(`ip`, `port`, `unitId`);
