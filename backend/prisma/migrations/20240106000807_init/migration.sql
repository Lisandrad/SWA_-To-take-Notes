/*
  Warnings:

  - You are about to drop the column `taskDescription` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `taskName` on the `Note` table. All the data in the column will be lost.
  - Added the required column `noteDescription` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noteName` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Note] DROP COLUMN [taskDescription],
[taskName];
ALTER TABLE [dbo].[Note] ADD [noteDescription] NVARCHAR(1000) NOT NULL,
[noteName] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
