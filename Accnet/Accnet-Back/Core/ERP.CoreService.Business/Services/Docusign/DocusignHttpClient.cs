using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Core.Models.Docusign;
using Newtonsoft.Json;

namespace ERP.CoreService.Business.Services.Docusign
{
    public class DocusignHttpClient
    {

        private static string Host = "https://account-d.docusign.com";

        public DocusignHttpClient()
        {
            
        }

        public async Task<Result<string>> GetAccessToken(string accessCode)
        {
            
            var _httpClient = new HttpClient();

            var values = new Dictionary<string, string>
            {
                {"grant_type", "authorization_code"},
                {"code",accessCode}
            };

            var content = new FormUrlEncodedContent(values);
            _httpClient.DefaultRequestHeaders.Add("Authorization",
                "Basic OGQ1MDNhMjQtZjJmOS00NzU1LTgyNmQtOWYxNTg5ZDhlODhhOmJhMmNkOGFhLWI5MWMtNGU0ZS05NWI5LWI4NWMyZDE1YjFhZA=="); // get from postman

            _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type",
                "application/x-www-form-urlencoded");
            var responseMessage = await _httpClient.PostAsync(Host + "/oauth/token", content);
            var responseBody = await responseMessage.Content.ReadAsStringAsync();
            var response = JsonConvert.DeserializeObject<AccessTokenModel>(responseBody);

            
            return Result<string>.Successful(response.access_token);
            
            
        }
        public async Task<Result<UserInfoModel>> GetUserInfo(string accessToken)
        {
            
            var _httpClient = new HttpClient();


            _httpClient.DefaultRequestHeaders.Add("Authorization",
                $"Bearer {accessToken}"); 

            var responseMessage = await _httpClient.GetAsync(Host + "/oauth/userinfo");
            var responseBody = await responseMessage.Content.ReadAsStringAsync();
            var response = JsonConvert.DeserializeObject<UserInfoModel>(responseBody);

            
            return Result<UserInfoModel>.Successful(response);
            
            
        }
    }
}