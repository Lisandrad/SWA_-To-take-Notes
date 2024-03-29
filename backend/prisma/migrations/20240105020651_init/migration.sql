BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[TaskList] (
    [_id] NVARCHAR(1000) NOT NULL,
    [taskName] NVARCHAR(1000) NOT NULL,
    [taskDescription] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [TaskList_pkey] PRIMARY KEY CLUSTERED ([_id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
