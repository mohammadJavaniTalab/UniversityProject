using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class TaxFile
    {
        public TaxFile()
        {
            ExtraTaxFile = new HashSet<ExtraTaxFile>();
            Tax = new HashSet<Tax>();
        }

        public Guid Id { get; set; }
        public Guid? EngagementBlobId { get; set; }
        public Guid? TaxFormBlobId { get; set; }
        public Guid? UserSignedEngagementId { get; set; }
        public Guid? UserSignedTaxFormId { get; set; }

        public Blob EngagementBlob { get; set; }
        public Blob TaxFormBlob { get; set; }
        public Blob UserSignedEngagement { get; set; }
        public Blob UserSignedTaxForm { get; set; }
        public ICollection<ExtraTaxFile> ExtraTaxFile { get; set; }
        public ICollection<Tax> Tax { get; set; }
    }
}
