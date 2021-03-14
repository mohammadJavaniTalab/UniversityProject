using System;
using System.Collections.Generic;

namespace ERP.MembershipService.Core.Models.Role
{
    public class UpdateRoleModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public ICollection<Guid> Feature { get; set; }
    }
}