using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class MustAnswered
    {
        public Guid Id { get; set; }
        public Guid AnswerId { get; set; }
        public Guid QuestionId { get; set; }

        public Answer Answer { get; set; }
        public Question Question { get; set; }
    }
}
