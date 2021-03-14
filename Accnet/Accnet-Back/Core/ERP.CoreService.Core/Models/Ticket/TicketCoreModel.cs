using System;
using System.Collections.Generic;
using ERP.CoreService.Core.Base;
using ERP.CoreService.Core.Models.Comment;
using ERP.MembershipService.ApiClient.Models.User;

namespace ERP.CoreService.Core.Models.Ticket
{
    public class TicketCoreModel : BaseCoreModel
    {
        public Guid? BlobId { get; set; }
        public LightUserModel User { get; set; }
        public LightUserModel Representative { get; set; }
        public DateTime CreationDate { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public bool Active { get; set; }
        public TicketPriority Priority { get; set; }

        public IList<CommentCoreModel> Comment { get; set; }

    }
}