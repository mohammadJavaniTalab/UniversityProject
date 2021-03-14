using System;
using ERP.CoreService.Core.Base;

namespace ERP.CoreService.Core.Models.Tax
{
    public class CreateTaxModel
    {
        public Guid UserId { get; set; }
        public decimal Amount { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool Enabled { get; set; }
        public TaxStatus? Status { get; set; }

    }
}