using System.Collections.Generic;
using ERP.CoreService.Core.Base;
using ERP.CoreService.Core.Models.Appointment;
using ERP.CoreService.Core.Models.Invoice;
using ERP.CoreService.Core.Models.Tax;

namespace ERP.CoreService.Core.Models.UserSurvey
{
    public class MarketingModel
    {
        public string Username { get; set; }
        public List<string> Taxes { get; set; } 
        public List<string> Invoices { get; set; } 
        public List<string> Appointments { get; set; } 
    }
}