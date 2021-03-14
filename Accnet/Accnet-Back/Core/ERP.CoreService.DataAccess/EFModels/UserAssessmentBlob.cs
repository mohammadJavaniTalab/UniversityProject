using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class UserAssessmentBlob
    {
        public Guid Id { get; set; }
        public Guid BlobId { get; set; }
        public Guid UserAssesmentSurveyId { get; set; }

        public Blob Blob { get; set; }
        public UserAssessmentSurvey UserAssesmentSurvey { get; set; }
    }
}
