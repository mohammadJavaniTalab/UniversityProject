using System;
using System.Collections.Generic;

namespace ERP.CoreService.Core.Models.Tax
{
    public class TaxFileModel
    {
        public Guid? EngagementBlobId { get; set; }
        public Guid? TaxFormBlobId { get; set; }
        
        public Guid? UserSignedEngagementId { get; set; }
        public Guid? UserSignedTaxFormId { get; set; }

        public List<ExtraTaxFileModel> ExtraTaxFile { get; set; }
    }
}