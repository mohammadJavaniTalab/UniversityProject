using System.Collections.Generic;
using ERP.CoreService.Core.Base;

namespace ERP.CoreService.Core.Models.Survey
{
    public class AnswerCoreModel : BaseCoreModel
    {

        public AnswerType Type { get; set; }
        public decimal Number { get; set; }
        public string Text { get; set; }
        public IList<ActionCoreModel> Actions { get; set; }
    }
}