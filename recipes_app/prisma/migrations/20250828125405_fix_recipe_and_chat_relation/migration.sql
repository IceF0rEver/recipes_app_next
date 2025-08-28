/*
  Warnings:

  - A unique constraint covering the columns `[chatId]` on the table `recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "recipe_chatId_key" ON "public"."recipe"("chatId");
