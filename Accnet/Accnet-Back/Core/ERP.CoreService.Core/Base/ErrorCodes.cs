namespace ERP.CoreService.Core.Base
{
    public class ErrorCodes : CoreLib.BaseErrorCodes
    {
        #region User(Prefix = 101)
        public const int MobileNumberIsRequiredForLoginOrRegister = 1011;
        public const int VerificationCodeIsNotValid = 1012;
        public const int CurrentBusinessUserProfileNotFound = 1013;
        #endregion

        #region Country(Prefix = 102)
        public const int CountryModelValidationMaximumLengthOfNameIs256Character = 1021;
        public const int CountryModelValidationInvalidPageNumberOrPageSize = 1022;
        public const int CountryNotFoundWithGivenId = 1023;
        public const int CountryIsRequired = 1023;
        #endregion

        #region City(Prefix = 103)
        public const int CityModelValidationMaximumLengthOfNameIs256Character = 1031;
        public const int CityNotFoundWithGivenId = 1032;
        public const int DestinationMustHave3OrMoreChars = 1033;
        public const int DestinationMustNotBeNull = 1034;
        public const int CityIsoCodeIsRequired = 1035;
        public const int CityNameIsRequired = 1036;

        #endregion

        #region Facility(Prefix=104)
        public const int FacilityModelValidationRequiredOfTitle = 1041;
        #endregion
        
        #region Currency(Prefix=105)
        public const int CurrencyNotFoundWithGivenId = 1051;
        public const int CurrencyNotFoundWithGivenAbbriviation = 1052;
        public const int BusinessBaseCurrencyCouldNotBeEdit = 1053;
        #endregion
        
        #region Nationality(Prefix=106)
        public const int NationalityNotFoundWithGivenId = 1061;
        public const int NationalitiesNotFound = 1062;
        #endregion
        
        #region BankGateway(Prefix=107)
        public const int NameIsRequired = 1071;
        public const int UsernameIsRequired = 1072;
        public const int BankGateWayNotFoundWithGivenId = 1073;
        public const int BankGatewayVerificationFailed = 1074;
        public const int AsanPardakhtGetTokenFailed = 1075;
        public const int AsanpardakhtSettlementIsNotSuccessfull = 1076;
        public const int PaymentTypeInvalid = 1077;
        #endregion
        
        #region Todo(Prefix=108)
        public const int TodoNotFoundWithGivenID = 1081;
        public const int DeletingRequiredDoneStatus = 1082;
        #endregion

        #region Hotel(Prefix=109)

        public const int BookingParamInvalid = 1091;

        #endregion
    }
}