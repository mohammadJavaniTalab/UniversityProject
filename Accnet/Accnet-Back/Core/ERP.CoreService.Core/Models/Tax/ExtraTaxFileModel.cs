using System;

namespace ERP.CoreService.Core.Models.Tax
{
    public class ExtraTaxFileModel
    {
        public Guid BlobId { get; set; }
        public string BlobName { get; set; }
        public string Name { get; set; }
        public bool? SetByAdmin { get; set; }
        public bool? Efile { get; set; }
    }
}