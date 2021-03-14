using ERP.MembershipService.Core.Base;
using ERP.MembershipService.Core.Models.User;

namespace ERP.MembershipService.Core.Models.Organization
{
    public class LinkedFullUserModel : BaseModel
    {
        public FullUserModel FirstUser { get; set; }
        public FullUserModel SecondUser { get; set; }
        public LinkStatus Status { get; set; }
        public string RelationType { get; set; }

    }
}