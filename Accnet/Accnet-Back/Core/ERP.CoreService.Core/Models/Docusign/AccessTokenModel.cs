namespace ERP.CoreService.Core.Models.Docusign
{
    public class AccessTokenModel
    {
        public string access_token { get; set; }
        public string token_type { get; set; }
        public string refresh_token { get; set; }
        public long expires_in { get; set; }
    }
}