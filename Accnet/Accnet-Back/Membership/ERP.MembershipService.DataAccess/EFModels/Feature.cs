using System;
using System.Collections.Generic;

namespace ERP.MembershipService.DataAccess.EFModels
{
    public partial class Feature
    {
        public Feature()
        {
            FeaturePermission = new HashSet<FeaturePermission>();
            RoleFeature = new HashSet<RoleFeature>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }

        public ICollection<FeaturePermission> FeaturePermission { get; set; }
        public ICollection<RoleFeature> RoleFeature { get; set; }
    }
}
