using System;
using System.Collections.Generic;

namespace ERP.MembershipService.Core.Models.Role
{
    public class CreateRoleModel
    {
        public string Name { get; set; }

        public ICollection<Guid> Feature { get; set; }

    }
}