using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class UserRelativeSurvey
    {
        public Guid Id { get; set; }
        public Guid UserSurveyId { get; set; }
        public Guid RelativeId { get; set; }

        public UserSurvey UserSurvey { get; set; }
    }
}
