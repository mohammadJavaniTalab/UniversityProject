using System;
using System.Collections.Generic;

namespace ERP.MembershipService.DataAccess.EFModels
{
    public partial class Role
    {
        public Role()
        {
            RoleFeature = new HashSet<RoleFeature>();
            User = new HashSet<User>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }

        public ICollection<RoleFeature> RoleFeature { get; set; }
        public ICollection<User> User { get; set; }
    }
}
