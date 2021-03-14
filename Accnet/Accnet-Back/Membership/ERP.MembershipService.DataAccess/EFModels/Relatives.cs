using System;
using System.Collections.Generic;

namespace ERP.MembershipService.DataAccess.EFModels
{
    public partial class Relatives
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string RelationType { get; set; }
        public string SinNumber { get; set; }

        public User User { get; set; }
    }
}
