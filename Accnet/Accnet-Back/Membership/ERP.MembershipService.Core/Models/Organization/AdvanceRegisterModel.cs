using System;
using ERP.MembershipService.Core.Models.User;

namespace ERP.MembershipService.Core.Models.Organization
{
    public class AdvanceRegisterModel
    {

        public CreateUserModel User { get; set; }
        public string RelationType { get; set; }

        public Guid SurveyId { get; set; }

        
    }
}