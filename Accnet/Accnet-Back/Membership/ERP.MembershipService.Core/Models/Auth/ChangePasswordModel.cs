using System;

namespace ERP.MembershipService.Core.Models.Auth
{
    public class ChangePasswordModel
    {
        public Guid UserId { get; set; }
        public string NewPassword { get; set; }
    }
}