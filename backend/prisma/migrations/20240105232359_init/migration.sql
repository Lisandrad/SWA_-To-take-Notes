/*
  Warnings:

  - You are about to drop the `TaskList` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `taskDescription` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskName` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Note] ADD [taskDescription] NVARCHAR(1000) NOT NULL,
[taskName] NVARCHAR(1000) NOT NULL;

-- DropTable
DROP TABLE [dbo].[TaskList];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
