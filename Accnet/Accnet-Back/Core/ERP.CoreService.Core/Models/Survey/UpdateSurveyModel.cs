using System;
using System.Collections.Generic;

namespace ERP.CoreService.Core.Models.Survey
{
    public class UpdateSurveyModel
    {

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public IList<QuestionCoreModel> Questions { get; set; }
        public bool? Enabled { get; set; }

    }
}