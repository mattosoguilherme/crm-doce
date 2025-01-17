-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT,
    "contato" TEXT NOT NULL,
    "produto" TEXT NOT NULL,
    "equipe" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "matricula" TEXT,
    "aniversario" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_contato_key" ON "User"("contato");

-- CreateIndex
CREATE UNIQUE INDEX "User_matricula_key" ON "User"("matricula");
