/*
  Warnings:

  - You are about to drop the column `chatId` on the `recipe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recipeId]` on the table `chat` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."recipe" DROP CONSTRAINT "recipe_chatId_fkey";

-- DropIndex
DROP INDEX "public"."recipe_chatId_key";

-- DropIndex
DROP INDEX "public"."recipe_userId_chatId_key";

-- AlterTable
ALTER TABLE "public"."chat" ADD COLUMN     "recipeId" TEXT;

-- AlterTable
ALTER TABLE "public"."recipe" DROP COLUMN "chatId";

-- CreateIndex
CREATE UNIQUE INDEX "chat_recipeId_key" ON "public"."chat"("recipeId");

-- AddForeignKey
ALTER TABLE "public"."chat" ADD CONSTRAINT "chat_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "public"."recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
