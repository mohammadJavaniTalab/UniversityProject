using System;

namespace ERP.CoreService.Core.Models.Paypal
{
    public class CaptureOrderModel
    {
        public Guid InvoiceId { get; set; }
        public string PayerId { get; set; }
        public string Token { get; set; }
    }
}