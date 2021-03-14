using System.Collections.Generic;
using ERP.MembershipService.Core.Models.Permission;

namespace ERP.MembershipService.Core.Models.Feature
{
    public class FeatureModel : BaseModel
    {
        public string Name { get; set; }
        public IList<PermissionModel> Permissions { get; set; }
    }
}