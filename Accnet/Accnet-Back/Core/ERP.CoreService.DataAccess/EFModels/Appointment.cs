using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class Appointment
    {
        public Guid Id { get; set; }
        public Guid? InvoiceId { get; set; }
        public Guid UserId { get; set; }
        public Guid? RepresentativeId { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime Date { get; set; }
        public int Duration { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public bool Approved { get; set; }

        public Invoice Invoice { get; set; }
    }
}
