/*
  Warnings:

  - A unique constraint covering the columns `[path,method,deletedAt]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Permission_path_method_deletedAt_key" ON "Permission"("path", "method") WHERE "deletedAt" IS NULL;
