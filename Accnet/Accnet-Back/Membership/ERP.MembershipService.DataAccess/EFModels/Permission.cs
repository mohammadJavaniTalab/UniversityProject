using System;
using System.Collections.Generic;

namespace ERP.MembershipService.DataAccess.EFModels
{
    public partial class Permission
    {
        public Permission()
        {
            FeaturePermission = new HashSet<FeaturePermission>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<FeaturePermission> FeaturePermission { get; set; }
    }
}
