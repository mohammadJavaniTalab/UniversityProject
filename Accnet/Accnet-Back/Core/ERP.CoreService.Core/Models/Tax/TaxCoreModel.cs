using System;
using ERP.MembershipService.ApiClient.Models.User;
using TaxStatus = ERP.CoreService.Core.Base.TaxStatus;

namespace ERP.CoreService.Core.Models.Tax
{
    public class TaxCoreModel : BaseCoreModel
    {

        public string RelationType { get; set; }
        public LightUserModel User { get; set; }
        public DateTime CreationDate { get; set; }
        public decimal Amount { get; set; }
        public string Title { get; set; }

        public TaxStatus Status { get; set; }
        public string Description { get; set; }
        public bool? Enabled { get; set; }

        public TaxFileModel TaxFile { get; set; }

    }
}