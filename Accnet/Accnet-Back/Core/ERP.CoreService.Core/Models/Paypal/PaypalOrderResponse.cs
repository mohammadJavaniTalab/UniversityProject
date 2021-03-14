using System.Collections.Generic;

namespace ERP.CoreService.Core.Models.Paypal
{
    public class PaypalOrderResponse
    {
        public string id { get; set; }
        public string status { get; set; }// CREATED

        public List<PaypalLink> links { get; set; }
    }

    public class PaypalLink
    {
        public string href { get; set; }
        public string rel { get; set; } // approve
        public string method { get; set; }
    }
}