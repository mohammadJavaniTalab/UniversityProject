namespace ERP.MembershipService.Core.Models.Auth
{
    public class LoginModel
    {

        public string Username { get; set; }
        public string Password { get; set; }

        public string Captcha { get; set; }
    }
}