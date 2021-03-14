using System;
using System.Collections.Generic;

namespace ERP.MembershipService.DataAccess.EFModels
{
    public partial class LinkedUser
    {
        public Guid Id { get; set; }
        public Guid FirstUserId { get; set; }
        public Guid SecondUserId { get; set; }
        public DateTime CreationDate { get; set; }
        public byte LinkStatus { get; set; }
        public string RelationType { get; set; }

        public User FirstUser { get; set; }
        public User SecondUser { get; set; }
    }
}
