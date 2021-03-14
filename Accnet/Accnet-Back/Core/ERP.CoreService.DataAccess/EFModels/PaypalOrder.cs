using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class PaypalOrder
    {
        public PaypalOrder()
        {
            Invoice = new HashSet<Invoice>();
        }

        public Guid Id { get; set; }
        public string OrderId { get; set; }
        public string Status { get; set; }
        public decimal Amount { get; set; }
        public string ApproveLink { get; set; }
        public string CaptureLink { get; set; }

        public ICollection<Invoice> Invoice { get; set; }
    }
}
