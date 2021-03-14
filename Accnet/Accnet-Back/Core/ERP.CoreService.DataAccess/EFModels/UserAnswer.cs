using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class UserAnswer
    {
        public Guid Id { get; set; }
        public Guid AnswerId { get; set; }
        public Guid UserSurveyId { get; set; }
        public string Text { get; set; }

        public Answer Answer { get; set; }
        public UserSurvey UserSurvey { get; set; }
    }
}
