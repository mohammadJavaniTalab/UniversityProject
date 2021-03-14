using System;
using ERP.CoreService.Core.Base;

namespace ERP.CoreService.Core.Models.Message
{
    public class CreateMessageModel
    {
        public Guid? ToUser { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public MessagePriority Priority { get; set; }

    }
}