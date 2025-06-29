-- CreateTable
CREATE TABLE `cardapio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `urlFoto` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `preco` DOUBLE NOT NULL,
    `cpu` DOUBLE NOT NULL,
    `lucro` DOUBLE NOT NULL,
    `quantidade_lote` INTEGER NOT NULL,
    `cpl` DOUBLE NOT NULL,
    `active` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `metodo_pagamento` VARCHAR(191) NOT NULL,
    `total` DOUBLE NOT NULL,
    `vendedor` VARCHAR(191) NOT NULL DEFAULT 'VENDEDOR',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `comandaId` INTEGER NULL,

    INDEX `pedido_comandaId_fkey`(`comandaId`),
    INDEX `pedido_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comanda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `nome_cliente` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDENTE',
    `saldo_pendente` DOUBLE NOT NULL,
    `saldo_quitado` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `sended` BOOLEAN NOT NULL DEFAULT false,
    `vendedor` VARCHAR(191) NOT NULL DEFAULT 'VENDEDOR',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `comanda_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedidoitem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cardapioId` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 1,
    `valor_unitario` DOUBLE NOT NULL,
    `pedidoId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PedidoItem_cardapioId_fkey`(`cardapioId`),
    INDEX `PedidoItem_pedidoId_fkey`(`pedidoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'VENDEDOR', 'USER') NULL DEFAULT 'USER',
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NULL,
    `contato` VARCHAR(191) NOT NULL,
    `produto` VARCHAR(191) NOT NULL,
    `unidade` VARCHAR(191) NOT NULL,
    `matricula` VARCHAR(191) NULL,
    `aniversario` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `messageLogId` INTEGER NULL,
    `celula` VARCHAR(191) NULL,
    `operacao` VARCHAR(191) NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_contato_key`(`contato`),
    UNIQUE INDEX `user_matricula_key`(`matricula`),
    UNIQUE INDEX `user_messageLogId_key`(`messageLogId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` BOOLEAN NOT NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `message_log_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `pedido_comandaId_fkey` FOREIGN KEY (`comandaId`) REFERENCES `comanda`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `pedido_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comanda` ADD CONSTRAINT `comanda_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidoitem` ADD CONSTRAINT `PedidoItem_cardapioId_fkey` FOREIGN KEY (`cardapioId`) REFERENCES `cardapio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidoitem` ADD CONSTRAINT `PedidoItem_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `pedido`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_messageLogId_fkey` FOREIGN KEY (`messageLogId`) REFERENCES `message_log`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
