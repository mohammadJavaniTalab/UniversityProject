USE [ERP.Core]
GO

IF (OBJECT_ID('app.spDeleteExpiredMappingData') IS NOT NULL)
    DROP PROCEDURE app.spDeleteExpiredMappingData
GO

CREATE PROCEDURE app.spDeleteExpiredMappingData
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE
        @Ids IdTableType

    WHILE 1 = 1
    BEGIN
        INSERT INTO @Ids
        SELECT TOP (5000) Id
        FROM MappingData
        WHERE GETDATE() >= DATEADD(MINUTE, 15, CreationDate)

        IF @@ROWCOUNT = 0
        BEGIN
            BREAK
        END

        BEGIN TRANSACTION
            DELETE MappingData
            WHERE EXISTS(SELECT 1
                         FROM @Ids S
                         WHERE S.Id = MappingData.Id)
        COMMIT
    END

    RETURN @@ROWCOUNT
END
GO
