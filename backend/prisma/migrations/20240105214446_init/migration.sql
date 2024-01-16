BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Note] (
    [_id] NVARCHAR(1000) NOT NULL,
    [isArchived] BIT NOT NULL,
    CONSTRAINT [Note_pkey] PRIMARY KEY CLUSTERED ([_id])
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