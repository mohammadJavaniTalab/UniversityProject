using ERP.CoreService.Core.Base;

namespace ERP.CoreService.Core.Models.Survey
{
    public class ActionCoreModel : BaseCoreModel
    {
        
        public ActionType Type { get; set; }
        public decimal Value { get; set; }

    }
}