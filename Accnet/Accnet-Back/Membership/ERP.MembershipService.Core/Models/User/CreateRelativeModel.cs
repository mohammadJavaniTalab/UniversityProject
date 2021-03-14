using System;

namespace ERP.MembershipService.Core.Models.User
{
    public class CreateRelativeModel
    {
        public Guid UserId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string RelationType { get; set; }
        public string SinNumber { get; set; }
    }
}