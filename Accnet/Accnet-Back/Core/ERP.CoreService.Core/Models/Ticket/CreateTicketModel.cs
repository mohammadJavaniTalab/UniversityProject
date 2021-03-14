using System;
using ERP.CoreService.Core.Base;

namespace ERP.CoreService.Core.Models.Ticket
{
    public class CreateTicketModel
    {
        public Guid? BlobId { get; set; }
        public Guid UserId { get; set; }
        public Guid RepresentativeId { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public TicketPriority Priority { get; set; }


    }
}