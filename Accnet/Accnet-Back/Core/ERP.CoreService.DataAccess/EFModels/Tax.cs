using System;
using System.Collections.Generic;

namespace ERP.CoreService.DataAccess.EFModels
{
    public partial class Tax
    {
        public Guid Id { get; set; }
        public Guid? UserSurveyId { get; set; }
        public Guid? TaxFileId { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreationDate { get; set; }
        public decimal Amount { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public byte Status { get; set; }
        public bool IsChecked { get; set; }
        public bool Enabled { get; set; }

        public TaxFile TaxFile { get; set; }
        public UserSurvey UserSurvey { get; set; }
    }
}
