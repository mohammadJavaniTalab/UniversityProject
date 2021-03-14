namespace ERP.CoreService.Core.Models.User
{
    public class UserUncheckedModel
    {
        public long UnreadMessages { get; set; }
        public long UnpaidInvoices { get; set; }
        public long UncheckedTaxes { get; set; }
        public bool HasDoneSurvey { get; set; }

    }
}