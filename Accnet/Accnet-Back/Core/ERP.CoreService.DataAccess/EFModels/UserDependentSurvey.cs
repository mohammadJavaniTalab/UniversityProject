using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class UserDependentSurvey
    {
        public Guid Id { get; set; }
        public Guid UserSurveyId { get; set; }
        public Guid UserId { get; set; }
        public bool TuitionFee { get; set; }

        public UserSurvey UserSurvey { get; set; }
    }
}
