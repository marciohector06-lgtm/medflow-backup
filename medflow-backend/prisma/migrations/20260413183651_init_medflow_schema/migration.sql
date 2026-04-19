-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GESTOR', 'RECEPCIONISTA', 'MEDICO');

-- CreateEnum
CREATE TYPE "StatusFila" AS ENUM ('AGUARDANDO', 'EM_ATENDIMENTO', 'AUSENTE', 'FINALIZADO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cargo" "Role" NOT NULL DEFAULT 'RECEPCIONISTA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "cep" TEXT,
    "logradouro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atendimento" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "status" "StatusFila" NOT NULL DEFAULT 'AGUARDANDO',
    "posicaoFila" INTEGER,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Atendimento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_cpf_key" ON "Paciente"("cpf");

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
