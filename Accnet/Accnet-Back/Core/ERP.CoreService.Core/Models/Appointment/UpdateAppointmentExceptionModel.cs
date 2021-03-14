using System;

namespace ERP.CoreService.Core.Models.Appointment
{
    public class UpdateAppointmentExceptionModel
    {
        public Guid Id { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }

    }
}