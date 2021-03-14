using System;
using System.Collections.Generic;

namespace ERP.CoreService.Core.Models.UserSurvey
{
    public class SurveyAnswerModel 
    {
        public List<Guid> AnswerIds { get; set; }
        public string UserAnswer { get; set; }
    }
}