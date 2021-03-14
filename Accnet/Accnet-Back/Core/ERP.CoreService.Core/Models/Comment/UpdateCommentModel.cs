using System;

namespace ERP.CoreService.Core.Models.Comment
{
    public class UpdateCommentModel
    {

        public Guid Id { get; set; }
        public Guid? BlobId { get; set; }
        public string Text { get; set; }

    }
}