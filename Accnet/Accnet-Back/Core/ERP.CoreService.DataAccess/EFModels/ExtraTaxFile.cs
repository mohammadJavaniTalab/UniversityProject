using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class ExtraTaxFile
    {
        public Guid Id { get; set; }
        public Guid BlobId { get; set; }
        public Guid TaxFileId { get; set; }
        public string Name { get; set; }
        public bool? SetByAdmin { get; set; }
        public bool? Efile { get; set; }

        public Blob Blob { get; set; }
        public TaxFile TaxFile { get; set; }
    }
}
