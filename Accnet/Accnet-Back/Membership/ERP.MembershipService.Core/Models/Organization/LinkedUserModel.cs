using System.Collections.Generic;
using ERP.MembershipService.Core.Base;
using ERP.MembershipService.Core.Models.User;

namespace ERP.MembershipService.Core.Models.Organization
{
    public class LinkedUserModel : BaseModel
    {
        public LightUserModel FirstUser { get; set; }
        public LightUserModel SecondUser { get; set; }
        public LinkStatus Status { get; set; }
        public string RelationType { get; set; }
        
    }
}