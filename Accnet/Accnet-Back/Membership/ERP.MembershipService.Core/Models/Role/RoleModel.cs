using System.Collections.Generic;
using ERP.MembershipService.Core.Models.Feature;

namespace ERP.MembershipService.Core.Models.Role
{
    public class RoleModel : BaseModel
    {
        public string Name { get; set; }

        public ICollection<FeatureModel> Feature { get; set; }

    }
}