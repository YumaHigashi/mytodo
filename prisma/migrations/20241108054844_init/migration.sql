-- CreateTable
CREATE TABLE "Todo" (
    "id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL,
    "removed" BOOLEAN NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
