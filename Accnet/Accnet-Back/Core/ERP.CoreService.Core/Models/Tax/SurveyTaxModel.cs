using System;
using System.Collections.Generic;
using ERP.CoreService.Core.Base;
using ERP.MembershipService.ApiClient.Models.User;

namespace ERP.CoreService.Core.Models.Tax
{
    public class SurveyTaxModel
    {
        public string SurveyName { get; set; }
        public Guid SurveyId { get; set; }
        public TaxStatus Status { get; set; }
        public LightUserModel MainUser { get; set; }
        public List<TaxCoreModel> Taxes { get; set; }
    }
}