using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class Action
    {
        public Guid Id { get; set; }
        public Guid AnswerId { get; set; }
        public byte Type { get; set; }
        public decimal Value { get; set; }

        public Answer Answer { get; set; }
    }
}
