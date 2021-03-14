using System;
using ERP.CoreService.Core.Base;

namespace ERP.CoreService.Core.Models.Ticket
{
    public class UpdateTicketModel
    {
        public Guid Id { get; set; }
        public Guid? BlobId { get; set; }
        public Guid? RepresentativeId { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public bool Active { get; set; }
        public TicketPriority Priority { get; set; }
        
    }
}