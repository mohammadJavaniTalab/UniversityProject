USE [ERP.Membership]
GO

IF(OBJECT_ID('app.spGetSupplier') IS NOT NULL)
    DROP PROCEDURE app.spGetSupplier
GO

CREATE PROCEDURE app.spGetSupplier
    @Id UNIQUEIDENTIFIER,
    @BusinessId UNIQUEIDENTIFIER,
    @Domain NVARCHAR(256)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    SELECT *
    FROM LocalSupplier
	WHERE (@Id IS NULL OR Id = @Id) AND
		  (Domain = @Domain) AND
	      (@BusinessId IS NULL OR BusinessId = @BusinessId) AND
	      [Enabled] = 1

    RETURN @@ROWCOUNT
END
GO