using System;
using ERP.CoreService.Core.Base;

namespace ERP.CoreService.Core.Models.Invoice
{
    public class CreateInvoiceModel
    {
        public Guid UserId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public InvoiceStatus Status { get; set; }
        public bool Enabled { get; set; }

        public Guid? UserSurveyId { get; set; }
    }
}