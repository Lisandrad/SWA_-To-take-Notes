/*
  Warnings:

  - The primary key for the `TaskList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `_id` on the `TaskList` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
BEGIN TRY

BEGIN TRAN;

-- RedefineTables
BEGIN TRANSACTION;
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'TaskList'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_TaskList] (
    [_id] INT NOT NULL IDENTITY(1,1),
    [taskName] NVARCHAR(1000) NOT NULL,
    [taskDescription] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [TaskList_pkey] PRIMARY KEY CLUSTERED ([_id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_TaskList] ON;
IF EXISTS(SELECT * FROM [dbo].[TaskList])
    EXEC('INSERT INTO [dbo].[_prisma_new_TaskList] ([_id],[taskDescription],[taskName]) SELECT [_id],[taskDescription],[taskName] FROM [dbo].[TaskList] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_TaskList] OFF;
DROP TABLE [dbo].[TaskList];
EXEC SP_RENAME N'dbo._prisma_new_TaskList', N'TaskList';
COMMIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
