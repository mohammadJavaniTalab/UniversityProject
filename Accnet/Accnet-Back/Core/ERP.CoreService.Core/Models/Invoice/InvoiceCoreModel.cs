using System;
using ERP.CoreService.Core.Base;
using ERP.MembershipService.ApiClient.Models.User;

namespace ERP.CoreService.Core.Models.Invoice
{
    public class InvoiceCoreModel : BaseCoreModel
    {
        public LightUserModel User { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        
        public DateTime CreationDate { get; set; }
        public decimal Amount { get; set; }
        public InvoiceStatus Status { get; set; }
        public bool Enabled { get; set; }

    }
}