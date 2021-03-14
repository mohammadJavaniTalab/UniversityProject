using System;
using System.Collections.Generic;
using ERP.CoreService.Core.Base;
using ERP.CoreService.Core.Models.Survey;

namespace ERP.CoreService.Core.Models.UserSurvey
{
    public class UserAnswerModel
    {
        public QuestionCoreModel Question { get; set; }

        public int QuestionCount { get; set; }
        public List<Guid> UserAnswerId { get; set; }
        public string UserAnswerText { get; set; }
        public AnswerType AnswerType { get; set; }
        public string AnswerText { get; set; }
    }
}