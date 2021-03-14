using System;

namespace ERP.CoreService.Core.Models.User
{
    public class CreateUserDependentModel
    {
        public Guid SurveyId { get; set; }
        public Guid UserId { get; set; }
        public string RelationType { get; set; }

        public bool TuitionFee { get; set; }
    }
}