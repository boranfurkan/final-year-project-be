/*
  Warnings:

  - A unique constraint covering the columns `[walletAddress,chain]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_chain_key" ON "User"("walletAddress", "chain");
