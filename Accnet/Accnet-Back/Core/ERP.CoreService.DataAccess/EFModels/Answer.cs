using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class Answer
    {
        public Answer()
        {
            Action = new HashSet<Action>();
            MustAnswered = new HashSet<MustAnswered>();
            UserAnswer = new HashSet<UserAnswer>();
        }

        public Guid Id { get; set; }
        public Guid QuestionId { get; set; }
        public DateTime ModifiedDate { get; set; }
        public decimal Number { get; set; }
        public string Text { get; set; }
        public byte Type { get; set; }

        public Question Question { get; set; }
        public ICollection<Action> Action { get; set; }
        public ICollection<MustAnswered> MustAnswered { get; set; }
        public ICollection<UserAnswer> UserAnswer { get; set; }
    }
}
