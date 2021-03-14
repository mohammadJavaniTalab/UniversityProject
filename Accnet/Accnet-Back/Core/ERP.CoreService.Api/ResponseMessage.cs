namespace ERP.CoreService.Api
{
    public class ResponseMessage
    {
        #region Common

        public const string InvalidUserId = "Invalid User Id";
        public const string InvalidEntityId = "Invalid Entity Id";
        public const string InvalidBlobId = "Invalid Blob Id";

        #endregion

        #region Invoice

        public const string InvoiceTitleCantBeEmpty = "Invoice Title Cant Be Empty";

        #endregion


        #region Survey

        public const string SurveyMustHaveName = "Survey Must have a name";
        public const string SurveyMustHaveQuestion = "Survey Must have a Question";

        #endregion
    }
}