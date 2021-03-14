using System;
using ERP.CoreService.Core.Models.Survey;
using ERP.MembershipService.ApiClient.Models.User;

namespace ERP.CoreService.Core.Models.UserSurvey
{
    public class UserSurveyModel 
    {
        public LightUserModel User { get; set; }
        public bool IsFinished { get; set; }
        
        public bool IsStarted { get; set; }
        public Guid SurveyId { get; set; }

        public string SurveyName { get; set; }
        public string SurveyDescription { get; set; }

        public bool MakeAnAppointment { get; set; }
        
        public bool UserCartUpdated  { get; set; }
        
        public Guid? InvoiceId { get; set; }

        public int QuestionCount { get; set; }
        public QuestionCoreModel NextQuestion { get; set; }

    }
}