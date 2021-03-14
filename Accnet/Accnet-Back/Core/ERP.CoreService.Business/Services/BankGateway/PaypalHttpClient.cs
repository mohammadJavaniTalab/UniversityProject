using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Core.Models.Paypal;
using ERP.CoreService.DataAccess.EFModels;
using Newtonsoft.Json;

namespace ERP.CoreService.Business.Services.BankGateway
{
    public class PaypalHttpClient
    {
        public PaypalHttpClient()
        {
        }

        public async Task<Result<PaypalOrder>> Order(string invoiceId, decimal amount)
        {
            var _httpClient = new HttpClient();
            amount = Math.Round(amount * 100) / 100;

            var login = await Login();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {login.Data}");
//            _httpClient.DefaultRequestHeaders.Add("Content-Type", "application/json");
            _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/json");

            var requestBody = new
            {
                intent = "CAPTURE",
                application_context = new
                {
                    return_url = $"https://accnetonline.com/payment/success?invoiceId={invoiceId}",
                    cancel_url = $"https://accnetonline.com/payment/failed"
                },
                purchase_units = new List<object>
                {
                    new
                    {
                        reference_id = invoiceId,
                        amount = new
                        {
                            currency_code = "CAD",
                            value = (float) amount
                        }
                    }
                }
            };

            var stringContent = new StringContent(JsonConvert.SerializeObject(requestBody), UnicodeEncoding.UTF8,
                "application/json");

            var responseMessage = await _httpClient.PostAsync(Host + "/v2/checkout/orders", stringContent);
            var responseBody = await responseMessage.Content.ReadAsStringAsync();

            var response = JsonConvert.DeserializeObject<PaypalOrderResponse>(responseBody);
            return Result<PaypalOrder>.Successful(new PaypalOrder
            {
                Id = Guid.NewGuid(),
                OrderId = response.id,
                Amount = amount,
                Status = response.status,
                ApproveLink = response.links.FirstOrDefault(l => l.rel == "approve")?.href,
                CaptureLink = response.links.FirstOrDefault(l => l.rel == "capture")?.href
            });
        }

        public async Task<Result> Capture(string orderId)
        {
            var _httpClient = new HttpClient();
            var login = await Login();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {login.Data}");
            _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/json");
            var stringContent = new StringContent("", UnicodeEncoding.UTF8, "application/json");

            var responseMessage =
                await _httpClient.PostAsync(Host + $"/v2/checkout/orders/{orderId}/capture", stringContent);

            var responseBody = await responseMessage.Content.ReadAsStringAsync();

            Console.WriteLine("Capture Order " + responseBody);
            var response = JsonConvert.DeserializeObject<PaypalCaptureResponse>(responseBody);
            if (response.status == "COMPLETED")
                return Result.Successful();
            return Result.Failed(Error.WithData(1000, new[]
            {
                "Could not capture order ! status " + response.status
            }));
        }

        private async Task<Result<string>> Login()

        {
            var _httpClient = new HttpClient();

            var values = new Dictionary<string, string>
            {
                {"grant_type", "client_credentials"}
            };

            var content = new FormUrlEncodedContent(values);
            _httpClient.DefaultRequestHeaders.Add("Authorization",
                "Basic QVVkWFVEZWpOT0laVUswR2VQUkN1VlhxN1hoT04xY1RwN1dfaGhyYmdHLVNTQm5mQ2FOQXJ4OTJaUENyZlphOUEtbEItRU9Od3hrR1RMQ3c6RUhfMzRhUUdXVE5ITWNNTERfc0Z4LTFGeHo1VU5sQkItS05BYzNEY3gxblRBTGZJVDFEVTQtTmxfeVdQRVZFcjh1WFplcmxUcnNYekRYUmM="); // get from postman
//                "Basic QVRsNUdmRmswUGNOU0IxU2NHUXNObXQtZV9NVFFiX3MzdENUeFk1UTRqTTZDR0hRV3RkWUh3c3FVR0hLajJxQy1QOGtmdWgzQ3hfZEtaT046RUx2Z0o3RWZ5Y2VLUWdCcWFxc0FYREtEXzVDQ0FhaXNTQ01XUm01Yzh5eVlTQ3RlUXFLSHZBLXZrZmU0WWk5Y0dkcVVhOEVFZWRBMXhsN20="); // get from postman

//                _httpClient.DefaultRequestHeaders.Add("content-type","application/x-www-form-urlencoded");
            _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type",
                "application/x-www-form-urlencoded");
            var responseMessage = await _httpClient.PostAsync(Host + "/v1/oauth2/token", content);
            var responseBody = await responseMessage.Content.ReadAsStringAsync();

            var response = JsonConvert.DeserializeObject<PaypalLoginResponse>(responseBody);
            return Result<string>.Successful(response.access_token);
        }


        private string Host { get; } = "https://api.paypal.com";
//        private string Host { get; } = "https://api.sandbox.paypal.com";
    }
}