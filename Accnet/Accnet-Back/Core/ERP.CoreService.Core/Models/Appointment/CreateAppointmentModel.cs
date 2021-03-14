using System;

namespace ERP.CoreService.Core.Models.Appointment
{
    public class CreateAppointmentModel
    {
        public Guid UserId { get; set; }
        
        
        public Guid? RepresentativeId { get; set; }
        public DateTime Date { get; set; }
        
        public int Duration { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        
        public string Type { get; set; }

        public bool Approved { get; set; }
        public bool SurveyRelated { get; set; }

    }
}