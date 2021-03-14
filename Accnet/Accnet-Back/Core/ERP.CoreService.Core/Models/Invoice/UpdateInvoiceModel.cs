using System;
using ERP.CoreService.Core.Base;

namespace ERP.CoreService.Core.Models.Invoice
{
    public class UpdateInvoiceModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public InvoiceStatus Status { get; set; }
        public bool Enabled { get; set; }
    }
}