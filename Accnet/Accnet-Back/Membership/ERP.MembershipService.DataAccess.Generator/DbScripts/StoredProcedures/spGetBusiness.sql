USE [ERP.Membership]
GO

IF(OBJECT_ID('app.spGetBusiness') IS NOT NULL)
    DROP PROCEDURE app.spGetBusiness
GO

CREATE PROCEDURE app.spGetBusiness
    @Id UNIQUEIDENTIFIER,
    @Domain NVARCHAR(256)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    SELECT *
    FROM Business
	WHERE (@Id IS NULL OR Id = @Id) AND
		  (Domain = @Domain) AND
	      [Enabled] = 1

    RETURN @@ROWCOUNT
END
GO