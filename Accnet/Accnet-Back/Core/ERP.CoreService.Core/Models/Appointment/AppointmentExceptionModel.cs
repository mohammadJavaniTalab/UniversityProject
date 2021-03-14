using System;

namespace ERP.CoreService.Core.Models.Appointment
{
    public class AppointmentExceptionModel
    {
        public Guid Id { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        
    }
}