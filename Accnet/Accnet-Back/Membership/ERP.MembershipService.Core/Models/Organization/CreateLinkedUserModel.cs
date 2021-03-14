using System;
using System.Collections.Generic;
using ERP.MembershipService.Core.Base;

namespace ERP.MembershipService.Core.Models.Organization
{
    public class CreateLinkedUserModel
    {
        public Guid? FirstUserId { get; set; }
        public Guid SecondUserId { get; set; }
        public string RelationType { get; set; }

    }
}