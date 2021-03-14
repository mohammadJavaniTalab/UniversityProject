using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using CoreLib;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ERP.CoreService.Business.Services.Google
{
    public class Captcha
    {
        private string siteKey = "6LewOu4UAAAAAKXx3f0SZ-twVtWmzsWh3IiVpzCz";
        private string secretKey = "6LewOu4UAAAAACBtF26wb-lmCVFSxxXQCGrgjdYC";

        public Captcha()
        {
        }

        public  Task<Result<bool>> Verify(string token)
            => Result<bool>.TryAsync(async () =>
            {
                var httpClient = new HttpClient();
                var stringContent = new StringContent(JsonConvert.SerializeObject(new
                    {
                        secret = secretKey,
                        response = token
                    }), UnicodeEncoding.UTF8,
                    "application/json");

                var responseMessage =
                    await httpClient.GetAsync("https://www.google.com/recaptcha/api/siteverify?secret="+secretKey+"&response="+token);
                var responseBody = await responseMessage.Content.ReadAsStringAsync();

                Console.WriteLine(" captchaaaa response   :::   "+responseBody);
                var response = JsonConvert.DeserializeObject<JObject>(responseBody);

                bool success = (bool) response["success"];

                return Result<bool>.Successful(success);
            });
    }
}