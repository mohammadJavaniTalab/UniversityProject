using System;
using ERP.CoreService.Core.Base;

namespace ERP.CoreService.Core.Models.Message
{
    public class UpdateMessageModel
    {

        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public MessagePriority Priority { get; set; }
        public bool Enabled { get; set; }

    }
}