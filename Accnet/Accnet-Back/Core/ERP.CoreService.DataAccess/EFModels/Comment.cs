using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class Comment
    {
        public Guid Id { get; set; }
        public Guid TicketId { get; set; }
        public Guid? BlobId { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreationDate { get; set; }
        public string Text { get; set; }

        public Blob Blob { get; set; }
        public Ticket Ticket { get; set; }
    }
}
