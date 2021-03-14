using System;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Services;

namespace ERP.CoreService.Business.Services.Sms
{
    public class SmsHttpClient : Base
    {
        private readonly ILogger _logger;

        public SmsHttpClient(IMapperService mapper, IMapper autoMapper,
            ILogger logger, IGeneralDataService generalDataService) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _logger = logger;
        }

        public async Task<Result> Send(string number, string text)
        {
            try
            {
                var http = new HttpClient();
                text = text.Replace(" ", "%20");
//                _httpClient.DefaultRequestHeaders.Add("content-type", "application/x-www-form-urlencoded");
                http.DefaultRequestHeaders.Add("Authorization",
                    "Basic Y2RiY2Y0ZWNiMzYxYWU1MWU0MmFlMTFiNGU3ZWFjMTA6YWNjbmV0aW5j");
                var httpResponseMessage = await http.GetAsync($"http://api.transmitsms.com/send-sms.json?message={text}&to=1{number}");
                var readAsStringAsync = await httpResponseMessage.Content.ReadAsStringAsync();
                return Result.Successful();
            }
            catch (Exception e)
            {
                _logger.Exception(e);
                return Result.Failed(Error.WithData(1000,new []{e.Message}));
            }
        }
    }
}