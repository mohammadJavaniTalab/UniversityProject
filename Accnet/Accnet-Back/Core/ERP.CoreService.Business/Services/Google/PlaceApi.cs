using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using CoreLib;
using Microsoft.EntityFrameworkCore.Internal;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ERP.CoreService.Business.Services.Google
{
    public class PlaceApi
    {
        public PlaceApi()
        {
        }

        public async Task<Result<object>> PredicatePlace(string type, string value)
        {
            var httpClient = new HttpClient();

            var responseMessage = await httpClient.GetAsync(
                $"https://maps.googleapis.com/maps/api/place/autocomplete/json?input={value}&types={type}&key=AIzaSyAdU_91JfDN7eXFDUuaA-C9LaGKAoQnjx4");
            var responseBody = await responseMessage.Content.ReadAsStringAsync();
            var response = JsonConvert.DeserializeObject<JObject>(responseBody);
            if (response["status"].ToString() != "OK")
                return Result<object>.Failed(Error.WithData(1000, new[] {response["status"].ToString()}));

            var validResults = (response["predictions"] as JArray)
                .ToList();

            return Result<object>.Successful(validResults);
        }

        public Task<Result<(string, string, string, string)>> PlaceDetail(string placeId)
            => Result<(string, string, string, string)>.TryAsync(async () =>
            {
                var httpClient = new HttpClient();

                var responseMessage = await httpClient.GetAsync(
                    $"https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&fields=address_components&key=AIzaSyAdU_91JfDN7eXFDUuaA-C9LaGKAoQnjx4");
                var responseBody = await responseMessage.Content.ReadAsStringAsync();
                var response = JsonConvert.DeserializeObject<JObject>(responseBody);
                if (response["status"].ToString() != "OK")
                    return Result<(string, string, string, string)>.Failed(Error.WithData(1000,
                        new[] {response["status"].ToString()}));

                var address = (response["result"]["address_components"] as JArray);

                Console.WriteLine(address.ToString());

                var province = address.FirstOrDefault(a =>
                    (a["types"] as JArray).Any(t => t.ToString() == "administrative_area_level_1"))?["long_name"];

                var city = address.FirstOrDefault(a =>
                    (a["types"] as JArray).Any(
                        aaaa => aaaa.ToString() == "locality" || aaaa.ToString() == "postal_town"))?["long_name"];

                var postalCode = address.FirstOrDefault(a =>
                    (a["types"] as JArray).Any(t => t.ToString() == "postal_code"))?["long_name"];

                var streetNumber = address.FirstOrDefault(a =>
                    (a["types"] as JArray).Any(t => t.ToString() == "street_number"))?["long_name"];

                var route = address.FirstOrDefault(a =>
                    (a["types"] as JArray).Any(t => t.ToString() == "route"))?["long_name"];

                return Result<(string, string, string, string)>.Successful((province?.ToString(),
                    city?.ToString(),
                    postalCode?.ToString(), route + " " + streetNumber)); // province name , city name , postal code
            });
    }
}