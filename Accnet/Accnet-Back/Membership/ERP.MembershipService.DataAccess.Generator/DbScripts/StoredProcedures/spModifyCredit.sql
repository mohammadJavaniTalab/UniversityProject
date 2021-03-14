USE [ERP.Membership]
GO

IF (OBJECT_ID('app.spModifyCredit') IS NOT NULL)
    DROP PROCEDURE app.spModifyCredit
GO

CREATE PROCEDURE app.spModifyCredit @BusinessId UNIQUEIDENTIFIER,
                                    @AgencyId UNIQUEIDENTIFIER,
                                    @LocalSupplierId UNIQUEIDENTIFIER,
                                    @UserId UNIQUEIDENTIFIER,
                                    @Username VARCHAR(256),
                                    @Amount DECIMAL(14, 3),
                                    @Description NVARCHAR(256)
AS
BEGIN
    IF (@AgencyId IS NULL AND @LocalSupplierId IS NULL)
        BEGIN
            IF(@Amount < 0 AND EXISTS(SELECT 1 FROM Business
                                      WHERE ID = @BusinessId AND
                                      (Credit + @Amount) < 0))
                RETURN -1; --CREDIT IS LOW
            UPDATE [Business] SET Credit = Credit + @Amount
            WHERE Id = @BusinessId
        END

    ELSE IF (@AgencyId IS NULL)
        BEGIN
            IF(@Amount < 0 AND EXISTS(SELECT 1 FROM LocalSupplier
                                      WHERE ID = @LocalSupplierId AND
                                            (Credit + @Amount) < 0))
                RETURN -1; --CREDIT IS LOW
            UPDATE [LocalSupplier] SET Credit = Credit + @Amount
            WHERE Id = @LocalSupplierId
        END

    ELSE IF (@LocalSupplierId IS NULL)
        BEGIN
            IF(@Amount < 0 AND EXISTS(SELECT 1 FROM Agency 
                WHERE ID = @AgencyId AND
                      (Credit + @Amount) < 0))
                RETURN -1; --CREDIT IS LOW
            UPDATE [Agency] SET Credit = Credit + @Amount
            WHERE Id = @AgencyId
        END
        
    RETURN @@ROWCOUNT
END
GO
