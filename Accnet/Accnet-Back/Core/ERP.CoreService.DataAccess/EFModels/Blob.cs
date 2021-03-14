using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class Blob
    {
        public Blob()
        {
            Comment = new HashSet<Comment>();
            ExtraTaxFile = new HashSet<ExtraTaxFile>();
            TaxFileEngagementBlob = new HashSet<TaxFile>();
            TaxFileTaxFormBlob = new HashSet<TaxFile>();
            TaxFileUserSignedEngagement = new HashSet<TaxFile>();
            TaxFileUserSignedTaxForm = new HashSet<TaxFile>();
            Ticket = new HashSet<Ticket>();
            UserAssessmentBlob = new HashSet<UserAssessmentBlob>();
        }

        public Guid Id { get; set; }
        public DateTime CreationDate { get; set; }
        public string Title { get; set; }
        public string ContentType { get; set; }
        public byte[] File { get; set; }

        public ICollection<Comment> Comment { get; set; }
        public ICollection<ExtraTaxFile> ExtraTaxFile { get; set; }
        public ICollection<TaxFile> TaxFileEngagementBlob { get; set; }
        public ICollection<TaxFile> TaxFileTaxFormBlob { get; set; }
        public ICollection<TaxFile> TaxFileUserSignedEngagement { get; set; }
        public ICollection<TaxFile> TaxFileUserSignedTaxForm { get; set; }
        public ICollection<Ticket> Ticket { get; set; }
        public ICollection<UserAssessmentBlob> UserAssessmentBlob { get; set; }
    }
}
