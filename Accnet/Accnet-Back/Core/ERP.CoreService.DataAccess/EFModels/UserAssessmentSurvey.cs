using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class UserAssessmentSurvey
    {
        public UserAssessmentSurvey()
        {
            UserAssessmentBlob = new HashSet<UserAssessmentBlob>();
        }

        public Guid Id { get; set; }
        public Guid UserSurveyId { get; set; }
        public Guid UserId { get; set; }

        public UserSurvey UserSurvey { get; set; }
        public ICollection<UserAssessmentBlob> UserAssessmentBlob { get; set; }
    }
}
