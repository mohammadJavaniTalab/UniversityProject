using System;
using ERP.CoreService.Core.Models.Survey;

namespace ERP.CoreService.Core.Models.UserSurvey
{
    public class ExceptionQuestionModel
    {
        public QuestionCoreModel Question { get; set; }
        public Guid? UserAnswerId { get; set; }

    }
}