using System;
using ERP.MembershipService.Core.Base;

namespace ERP.MembershipService.Core.Models.Organization
{
    public class UpdateLinkedUserModel
    {
        public Guid Id { get; set; }
        
        public string RelationType { get; set; }
        public LinkStatus Status { get; set; }
    }
}