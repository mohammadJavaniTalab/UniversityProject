using System;
using ERP.MembershipService.ApiClient.Models.User;

namespace ERP.CoreService.Core.Models.Comment
{
    public class CommentCoreModel : BaseCoreModel
    {
        public Guid? BlobId { get; set; }
        public LightUserModel User { get; set; }
        public DateTime CreationDate { get; set; }
        public string Text { get; set; }

    }
}