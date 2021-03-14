using System.Collections.Generic;

namespace ERP.CoreService.Core.Models.Survey
{
    public class QuestionCoreModel : BaseCoreModel
    {

        public decimal Number { get; set; }
        public string Text { get; set; }
        public IList<AnswerCoreModel> Answers { get; set; }
        public IList<decimal> MustAnsweredNumber { get; set; }
        
        
        
    }
}