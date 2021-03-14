using System;
using ERP.CoreService.Core.Models.Invoice;
using ERP.MembershipService.ApiClient.Models.User;

namespace ERP.CoreService.Core.Models.Appointment
{
    public class AppointmentCoreModel : BaseCoreModel
    {
        public LightUserModel User { get; set; }

        public InvoiceCoreModel Invoice { get; set; }
        public LightUserModel Representative { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime Date { get; set; }

        public int Duration { get; set; }

        public string Type { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool Approved { get; set; }

    }
}