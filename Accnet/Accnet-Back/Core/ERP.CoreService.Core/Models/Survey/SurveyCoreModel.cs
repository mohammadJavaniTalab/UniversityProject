using System.Collections.Generic;
using ERP.MembershipService.ApiClient.Models.User;

namespace ERP.CoreService.Core.Models.Survey
{
    public class SurveyCoreModel : BaseCoreModel
    {
        public LightUserModel CreatedBy { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public IList<QuestionCoreModel> Questions { get; set; }
        public bool Enabled { get; set; }


    }
}