using System;
using System.Collections.Generic;
using ERP.MembershipService.Core.Base;
using ERP.MembershipService.Core.Models.Organization;
using ERP.MembershipService.Core.Models.Role;

namespace ERP.MembershipService.Core.Models.User
{
    public class LightUserModel : BaseModel
    {
        public string Username { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Gender { get; set; }
        public Guid? AvatarId { get; set; }
        public RoleModel Role { get; set; }
        public bool CompletedProfile { get; set; }
        public bool HasDoneSurvey { get; set; }
        public bool Enabled { get; set; }
        public long UnreadMessages { get; set; }
        public long UnpaidInvoices { get; set; }
        public long UncheckedTaxes { get; set; }
        public long UncheckedRequestLinks { get; set; }
    }
}