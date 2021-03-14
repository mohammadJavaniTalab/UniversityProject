using System;
using System.Collections.Generic;

namespace ERP.MembershipService.DataAccess.EFModels
{
    public partial class FeaturePermission
    {
        public Guid Id { get; set; }
        public Guid FeatureId { get; set; }
        public int PermissionId { get; set; }

        public Feature Feature { get; set; }
        public Permission Permission { get; set; }
    }
}
