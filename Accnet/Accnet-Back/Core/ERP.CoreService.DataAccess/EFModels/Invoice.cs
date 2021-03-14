using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class Invoice
    {
        public Invoice()
        {
            Appointment = new HashSet<Appointment>();
            UserSurvey = new HashSet<UserSurvey>();
        }

        public Guid Id { get; set; }
        public Guid? PaypalOrderId { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreationDate { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal Amount { get; set; }
        public byte Status { get; set; }
        public bool IsPaid { get; set; }
        public bool Enabled { get; set; }

        public PaypalOrder PaypalOrder { get; set; }
        public ICollection<Appointment> Appointment { get; set; }
        public ICollection<UserSurvey> UserSurvey { get; set; }
    }
}
