using System;
using System.Collections.Generic;

namespace ERP.MembershipService.DataAccess.EFModels
{
    public partial class RoleFeature
    {
        public Guid Id { get; set; }
        public Guid RoleId { get; set; }
        public Guid FeatureId { get; set; }

        public Feature Feature { get; set; }
        public Role Role { get; set; }
    }
}
