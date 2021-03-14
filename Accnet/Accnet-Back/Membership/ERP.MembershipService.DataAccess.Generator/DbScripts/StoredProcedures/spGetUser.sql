USE [ERP.Membership]
GO

IF (OBJECT_ID('app.spGetUser') IS NOT NULL)
    DROP PROCEDURE app.spGetUser
GO

CREATE PROCEDURE app.spGetUser @Id UNIQUEIDENTIFIER,
                               @BusinessId UNIQUEIDENTIFIER,
                               @AgencyId UNIQUEIDENTIFIER,
                               @LocalSupplierId UNIQUEIDENTIFIER,
                               @Mobile VARCHAR(256),
                               @Username VARCHAR(256),
                               @Email NVARCHAR(256),
                               @Password NVARCHAR(512),
                               @ApiKey NVARCHAR(256),
                               @AgencyDomain NVARCHAR(64),
                               @OnlyCheckId BIT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE
        @RoleId UNIQUEIDENTIFIER

    SELECT TOP 1
           U.Id,
           U.CreationDate,
           U.Mobile,
           U.[Enabled],
           U.[Name],
           U.LastName,
           U.Username,
           U.Email,
           U.BusinessId,
           U.AgencyId,
           U.LocalSupplierId,
           U.IsB2B,
           U.Gender,
           U.NationalityId,
           U.NationalCode,
           U.RoleId,
           AC.Abbriviation AgencyCurrency,
           R.[Name]    RoleName,
           B.Domain    BusinessDomain,
           B.[Enabled] BusinessEnabled,
           B.ParentId  ParentBusinessId,
           B.[Name]    BusinessName,
           A.[Name]    AgencyName,
           A.CityId    AgencyCityId,
           A.[Type]    AgencyType,
           A.[Enabled] AgencyEnabled,
           A.Domain    AgencyDomain,
           S.[Name]    LocalSupplierName,
           S.[Domain]  LocalSupplierDomain,
           S.CityId    LocalSupplierCityId,
           S.[Type]    LocalSupplierType,
           S.[Enabled] LocalSupplierEnabled,
           SC.Abbriviation LocalSupplierCurrency,
           B.[Server]  BusinessServer
    FROM [User] U
             INNER JOIN [Role] R ON U.RoleId = R.Id
             INNER JOIN [Business] B ON B.Id = U.BusinessId
             LEFT JOIN [Agency] A ON A.Id = U.AgencyId
             LEFT JOIN [ERP.Core].[dbo].[Currency] AC ON AC.Id = A.CreditCurrencyId
             LEFT JOIN [LocalSupplier] S ON S.Id = U.LocalSupplierId
             LEFT JOIN [ERP.Core].[dbo].[Currency] SC ON SC.Id = S.CreditCurrencyId
    WHERE (@ApiKey IS NULL OR (A.ApiKey = @ApiKey AND A.Domain = @AgencyDomain AND U.IsManager = 1))
      AND (@Id IS NULL OR U.Id = @Id)
      AND (@Mobile IS NULL OR U.Mobile = @Mobile)
      AND (@Username IS NULL OR U.Username = @Username)
      AND (@Email IS NULL OR U.Email = @Email)
      AND (@OnlyCheckId = 1 OR @ApiKey IS NOT NULL OR B.Id = @BusinessId)
      AND (@OnlyCheckId = 1 OR @ApiKey IS NOT NULL OR A.Id IS NULL OR A.Id = @AgencyId)
      AND (@OnlyCheckId = 1 OR @ApiKey IS NOT NULL OR S.Id IS NULL OR S.Id = @LocalSupplierId)
      AND (@OnlyCheckId = 1 OR @ApiKey IS NOT NULL OR U.[Password] = @Password)
      AND U.Enabled = 1

    SELECT @RoleId = RoleId
    FROM [User] U
             INNER JOIN [Business] B ON B.Id = U.BusinessId
             LEFT JOIN [Agency] A ON A.Id = U.AgencyId
             LEFT JOIN [LocalSupplier] S ON S.Id = U.LocalSupplierId
    WHERE (@ApiKey IS NULL OR (A.ApiKey = @ApiKey AND A.Domain = @AgencyDomain AND U.IsManager = 1))
      AND (@Id IS NULL OR U.Id = @Id)
      AND (@Mobile IS NULL OR U.Mobile = @Mobile)
      AND (@Username IS NULL OR U.Username = @Username)
      AND (@Email IS NULL OR U.Email = @Email)
      AND (@OnlyCheckId = 1 OR @ApiKey IS NOT NULL OR B.Id = @BusinessId)
      AND (@OnlyCheckId = 1 OR @ApiKey IS NOT NULL OR A.Id IS NULL OR A.Id = @AgencyId)
      AND (@OnlyCheckId = 1 OR @ApiKey IS NOT NULL OR S.Id IS NULL OR S.Id = @LocalSupplierId)
      AND (@OnlyCheckId = 1 OR @ApiKey IS NOT NULL OR U.[Password] = @Password)

    SELECT SupplierId,
           SupplierType,
           IsLocal
    FROM AgencySupplierException
    WHERE AgencyId = @AgencyId

    SELECT PermissionDeniedId
    FROM [RolePermissionDenied]
    WHERE RoleId = @RoleId

    IF(@AgencyId IS NULL AND @LocalSupplierId IS NULL)
        SELECT FP.PermissionId,
               P.Name PermissionName,
               F.Name FeatureName,
               F.Module
        FROM RoleFeature RF
                 INNER JOIN Feature F ON F.Id = RF.FeatureId
                 INNER JOIN FeaturePermission FP ON F.Id = FP.FeatureId
                 INNER JOIN Permission P ON P.Id = FP.PermissionId
        WHERE RoleId = @RoleId
        AND EXISTS(SELECT 1 FROM BusinessFeature BF WHERE F.Id = BF.FeatureId AND BF.BusinessId = @BusinessId)
    
    ELSE IF(@LocalSupplierId IS NULL)
        SELECT FP.PermissionId,
               P.Name PermissionName,
               F.Name FeatureName,
               F.Module
        FROM RoleFeature RF
                 INNER JOIN Feature F ON F.Id = RF.FeatureId
                 INNER JOIN FeaturePermission FP ON F.Id = FP.FeatureId
                 INNER JOIN Permission P ON P.Id = FP.PermissionId
        WHERE RoleId = @RoleId
        AND EXISTS(SELECT 1 FROM AgencyFeature AF WHERE F.Id = AF.FeatureId AND AF.AgencyId = @AgencyId)

    ELSE IF(@AgencyId IS NULL)
        SELECT FP.PermissionId,
               P.Name PermissionName,
               F.Name FeatureName,
               F.Module
        FROM RoleFeature RF
                 INNER JOIN Feature F ON F.Id = RF.FeatureId
                 INNER JOIN FeaturePermission FP ON F.Id = FP.FeatureId
                 INNER JOIN Permission P ON P.Id = FP.PermissionId
        WHERE RoleId = @RoleId
        AND EXISTS(SELECT 1 FROM LocalSupplierFeature LF WHERE F.Id = LF.FeatureId AND LF.LocalSupplierId = @LocalSupplierId)

    RETURN @@ROWCOUNT
END
GO
