using System;

namespace ERP.CoreService.Core.Models.Comment
{
    public class CreateCommentModel
    {
        public Guid? BlobId { get; set; }
        public Guid TicketId { get; set; }
        public string Text { get; set; }

    }
}