using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class Message
    {
        public Guid Id { get; set; }
        public Guid FromUserId { get; set; }
        public Guid ToUserId { get; set; }
        public DateTime CreationDate { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public byte Priority { get; set; }
        public bool IsRead { get; set; }
        public bool Enabled { get; set; }
    }
}
