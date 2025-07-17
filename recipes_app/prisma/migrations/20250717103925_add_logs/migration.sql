-- CreateEnum
CREATE TYPE "log_actions" AS ENUM ('USER_DELETE', 'USER_SUSPEND', 'USER_ACTIVATE', 'ROLE_CHANGE', 'SESSION_REVOKE');

-- CreateEnum
CREATE TYPE "log_status" AS ENUM ('SUCCESS', 'FAILED', 'PENDING');

-- CreateTable
CREATE TABLE "log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "log_actions" NOT NULL,
    "targetId" TEXT NOT NULL,
    "status" "log_status" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
