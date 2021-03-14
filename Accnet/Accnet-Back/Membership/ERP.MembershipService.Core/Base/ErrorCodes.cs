namespace ERP.MembershipService.Core.Base
{
    public class ErrorCodes : CoreLib.BaseErrorCodes
    {
        #region User(Prefix = 401)

        public const int VerificationCodeIsNotValid = 4010;
        public const int UserModelValidationMobileNumberIsRequiredForLoginOrRegister = 4011;
        public const int UserModelValidationMaximumLengthOfUsernameIs256Character = 4012;
        public const int UserModelValidationMaximumLengthOfFirstNameIs256Character = 4013;
        public const int UserModelValidationMaximumLengthOfLastNameIs256Character = 4014;
        public const int UserModelValidationMaximumLengthOfPasswordIs512Character = 4015;
        public const int UserModelValidationMaximumLengthOfMobileIs256Character = 4016;
        public const int UserModelValidationMaximumLengthOfPhoneIs256Character = 4017;
        public const int UserModelValidationMaximumLengthOfEmailIs256Character = 4017;
        public const int UserModelValidationMaximumLengthOfAvatarIs1024Character = 4018;
        public const int UserModelValidationMaximumLengthOfNationalCodeIs512Character = 4019;
        public const int UserModelValidationMaximumLengthOfTokenIs512Character = 40110;
        public const int UserNotFound = 40111;
        public const int UserAlreadyInOrganization = 40111;
        public const int UserNameIsReuiqred = 40112;
        public const int UserNameAlreadyExist = 40113;
        public const int UserAlreadyExist = 40114;
        public const int RoleIdIsRequired = 40115;

        #endregion

        #region Auth(Prefix = 402)

        public const int AuthModelValidtionOneOfMobileOrEmailOrUsernameIsRequired = 4020;
        public const int AuthModelValidtionPasswordIsRequired = 4021;
        public const int SmsTokenModelValidationMaximumLengthOfCodeIs5Character = 4022;
        public const int SmsTokenModelValidationCodeIsRequired = 4023;
        public const int SmsTokenInvalidCode = 4024;

        #endregion

    }
}