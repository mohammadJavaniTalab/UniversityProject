USE [ERP.Membership]
GO

IF(OBJECT_ID('app.spCreateOrUpdateUser') IS NOT NULL)
    DROP PROCEDURE app.spCreateOrUpdateUser
GO

CREATE PROCEDURE app.spCreateOrUpdateUser
    @Id UNIQUEIDENTIFIER,
    @RoleId UNIQUEIDENTIFIER,
    @BusinessId UNIQUEIDENTIFIER,
    @AgencyId UNIQUEIDENTIFIER,
    @LocalSupplierId UNIQUEIDENTIFIER,
    @NationalityId UNIQUEIDENTIFIER,
    @Name NVARCHAR(32),
    @Lastname NVARCHAR(32),
    @Mobile VARCHAR(32),
    @NationalCode VARCHAR(64),
    @Email NVARCHAR(256),
    @Username NVARCHAR(64),
    @Password NVARCHAR(256),
    @Gender BIT,
    @Enabled BIT,
    @IsB2B BIT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @Res INT

    BEGIN TRAN
        IF(@Id IS NULL)
            BEGIN
                SET @Id = NEWID()
                INSERT INTO [User]
                VALUES(@Id, @RoleId, @BusinessId, @AgencyId, @LocalSupplierId, @NationalityId, GETDATE(),
                       @Name, @Lastname, @Mobile, @NationalCode, @Email, @Username, @Password,
                       @Gender, @Enabled, @IsB2B)

                SELECT @Id
            END

        ELSE
            UPDATE [User]
            SET RoleId = @RoleId,
                NationalityId = @NationalityId,
                [Name] = @Name,
                Lastname = @Lastname,
                Mobile = @Mobile,
                NationalCode = @NationalCode,
                Email = @Email,
                Username = @Username,
                [Password] = @Password,
                Gender = @Gender,
                [Enabled] = @Enabled
            WHERE Id = @Id

        SET @Res = @@ROWCOUNT
    COMMIT

    RETURN @Res
END
