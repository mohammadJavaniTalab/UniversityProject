using System;

namespace ERP.CoreService.Core.Models.Appointment
{
    public class UpdateAppointmentModel
    {

        public Guid Id { get; set; }
        public DateTime Date { get; set; }

        public string Type { get; set; }
        public int Duration { get; set; }

        public bool Approved { get; set; }

    }
}