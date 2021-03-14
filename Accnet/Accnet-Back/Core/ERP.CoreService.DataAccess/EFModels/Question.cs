using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class Question
    {
        public Question()
        {
            Answer = new HashSet<Answer>();
            MustAnswered = new HashSet<MustAnswered>();
        }

        public Guid Id { get; set; }
        public Guid SurveyId { get; set; }
        public DateTime ModifiedDate { get; set; }
        public decimal Number { get; set; }
        public string Text { get; set; }

        public Survey Survey { get; set; }
        public ICollection<Answer> Answer { get; set; }
        public ICollection<MustAnswered> MustAnswered { get; set; }
    }
}
