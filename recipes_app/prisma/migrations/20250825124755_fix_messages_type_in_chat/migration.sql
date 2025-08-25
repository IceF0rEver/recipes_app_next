/*
  Warnings:

  - The `messages` column on the `chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."chat" DROP COLUMN "messages",
ADD COLUMN     "messages" JSONB;
