using System;

namespace ERP.CoreService.Core.Models.Appointment
{
    public class CreateAppointmentExceptionModel
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }

    }
}