using System;
using TaxStatus = ERP.CoreService.Core.Base.TaxStatus;

namespace ERP.CoreService.Core.Models.Tax
{
    public class UpdateTaxModel
    {
        public Guid Id { get; set; }
        public Guid? BlobId { get; set; }
        public decimal Amount { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public TaxFileModel TaxFile { get; set; }
        public TaxStatus Status { get; set; }
        public bool Enabled { get; set; }

    }
}