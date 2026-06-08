-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'operator', 'supervisor', 'maintanace');

-- CreateEnum
CREATE TYPE "Mtcptypedata" AS ENUM ('INT16_SIGNED', 'INT16_UNSIGNED', 'INT32_BIG_ENDIAN', 'INT32_LITTLE_ENDIAN', 'FLOAT32_ABCD', 'FLOAT32_BADC', 'FLOAT32_CDAB', 'FLOAT32_DCBA', 'DOUBLE64', 'BOOLEAN', 'ASCII', 'BCD');

-- CreateEnum
CREATE TYPE "MtcpFC" AS ENUM ('FC1', 'FC2', 'FC3', 'FC4');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mtcplist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "timeout" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mtcplist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mtcpaddress" (
    "id" TEXT NOT NULL,
    "mtcpId" TEXT NOT NULL,
    "address" INTEGER NOT NULL,
    "functioncode" "MtcpFC" NOT NULL,
    "typedata" "Mtcptypedata" NOT NULL,
    "canread" BOOLEAN NOT NULL,
    "canwrite" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mtcpaddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "mtcpaddressId" TEXT,
    "name" TEXT NOT NULL,
    "offset" DECIMAL(10,3),
    "gain" DECIMAL(10,3),
    "unit" TEXT,
    "lowlow" DECIMAL(10,3),
    "low" DECIMAL(10,3),
    "high" DECIMAL(10,3),
    "highhigh" DECIMAL(10,3),
    "booltruestate" TEXT,
    "boolfalsestate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "itshare" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "w" INTEGER NOT NULL,
    "h" INTEGER NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "interval" INTEGER NOT NULL,
    "devices" BOOLEAN NOT NULL,
    "tags" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoggerTagslist" (
    "id" TEXT NOT NULL,
    "id_Logger" TEXT NOT NULL,
    "id_tags" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoggerTagslist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoggerDeviceslist" (
    "id" TEXT NOT NULL,
    "id_Logger" TEXT NOT NULL,
    "id_Mtcp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoggerDeviceslist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoggerSetTag" (
    "id" TEXT NOT NULL,
    "id_tags" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoggerSetTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Mtcplist_name_key" ON "Mtcplist"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Mtcplist_ip_port_unitId_key" ON "Mtcplist"("ip", "port", "unitId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Logger_name_key" ON "Logger"("name");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mtcpaddress" ADD CONSTRAINT "Mtcpaddress_mtcpId_fkey" FOREIGN KEY ("mtcpId") REFERENCES "Mtcplist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_mtcpaddressId_fkey" FOREIGN KEY ("mtcpaddressId") REFERENCES "Mtcpaddress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoggerTagslist" ADD CONSTRAINT "LoggerTagslist_id_Logger_fkey" FOREIGN KEY ("id_Logger") REFERENCES "Logger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoggerTagslist" ADD CONSTRAINT "LoggerTagslist_id_tags_fkey" FOREIGN KEY ("id_tags") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoggerDeviceslist" ADD CONSTRAINT "LoggerDeviceslist_id_Logger_fkey" FOREIGN KEY ("id_Logger") REFERENCES "Logger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoggerDeviceslist" ADD CONSTRAINT "LoggerDeviceslist_id_Mtcp_fkey" FOREIGN KEY ("id_Mtcp") REFERENCES "Mtcplist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoggerSetTag" ADD CONSTRAINT "LoggerSetTag_id_tags_fkey" FOREIGN KEY ("id_tags") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoggerSetTag" ADD CONSTRAINT "LoggerSetTag_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
