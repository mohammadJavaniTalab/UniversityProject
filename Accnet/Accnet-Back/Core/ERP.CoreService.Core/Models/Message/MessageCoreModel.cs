using System;
using ERP.CoreService.Core.Base;
using ERP.MembershipService.ApiClient.Models.User;

namespace ERP.CoreService.Core.Models.Message
{
    public class MessageCoreModel : BaseCoreModel
    {
        public LightUserModel FromUser { get; set; }
        public LightUserModel ToUser { get; set; }
        public DateTime CreationDate { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public MessagePriority Priority { get; set; }
        public bool? Enabled { get; set; }
        public bool IsRead { get; set; }

    }
}