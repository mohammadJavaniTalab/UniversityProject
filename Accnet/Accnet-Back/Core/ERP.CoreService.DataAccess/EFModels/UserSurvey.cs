using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class UserSurvey
    {
        public UserSurvey()
        {
            Tax = new HashSet<Tax>();
            UserAnswer = new HashSet<UserAnswer>();
            UserAssessmentSurvey = new HashSet<UserAssessmentSurvey>();
            UserDependentSurvey = new HashSet<UserDependentSurvey>();
            UserRelativeSurvey = new HashSet<UserRelativeSurvey>();
        }

        public Guid Id { get; set; }
        public Guid? TicketId { get; set; }
        public Guid? InvoiceId { get; set; }
        public Guid SurveyId { get; set; }
        public Guid UserId { get; set; }
        public bool IsFinsihed { get; set; }

        public Invoice Invoice { get; set; }
        public Survey Survey { get; set; }
        public Ticket Ticket { get; set; }
        public ICollection<Tax> Tax { get; set; }
        public ICollection<UserAnswer> UserAnswer { get; set; }
        public ICollection<UserAssessmentSurvey> UserAssessmentSurvey { get; set; }
        public ICollection<UserDependentSurvey> UserDependentSurvey { get; set; }
        public ICollection<UserRelativeSurvey> UserRelativeSurvey { get; set; }
    }
}
