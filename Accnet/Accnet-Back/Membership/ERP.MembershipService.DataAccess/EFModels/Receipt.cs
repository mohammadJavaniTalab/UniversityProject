using System;
using System.Collections.Generic;

namespace ERP.MembershipService.DataAccess.EFModels
{
    public partial class Receipt
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid BlobId { get; set; }

        public User User { get; set; }
    }
}
