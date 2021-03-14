using System;
using System.Collections.Generic;

namespace ERP.CoreService.Core.Models.User
{
    public class CreateUserAssessmentModel
    {
        public Guid SurveyId  { get; set; }
        public List<Guid> BlobIds { get; set; }
    }
}