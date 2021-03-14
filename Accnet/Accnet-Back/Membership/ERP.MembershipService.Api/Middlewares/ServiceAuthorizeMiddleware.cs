using System;
using System.Linq;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Services;
using CoreLib.Services.Models;
using Microsoft.AspNetCore.Http;

namespace ERP.MembershipService.Api.Middlewares
{
    public class ServiceAuthorizeMiddleware
    {
        private readonly RequestDelegate _next;

        public ServiceAuthorizeMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                var token = context.Request.Headers.FirstOrDefault(h => h.Key == "api-key").Value.First();
                var serviceName = context.Request.Headers.FirstOrDefault(h => h.Key == "api-name").Value.First();
                var authenticateService = (IAuthenticateService)context.RequestServices.GetService(typeof(IAuthenticateService));
                // if (!authenticateService.IsValidService(serviceName,token))
                // {
                    // context.Response.StatusCode = 401;
                    // return;
                // }
                var generalDataService = (IGeneralDataService)context.RequestServices.GetService(typeof(IGeneralDataService));
                generalDataService.RequestRoute = context.Request.Path;
                if (context.Request.Headers.Any(h => h.Key == "general-data"))
                {
                    var serializerService = (ISerializerService)context.RequestServices.GetService(typeof(ISerializerService));
                    var compressionService = (ICompressionService)context.RequestServices.GetService(typeof(ICompressionService));
                    var generalDataString = context.Request.Headers.First(h => h.Key == "general-data").Value.First();
                    generalDataString = compressionService.DecompressGzip(generalDataString);
                    var requestGeneralData = serializerService.DeserializeFromJson<GeneralDataService>(generalDataString);
                    generalDataService.User = requestGeneralData.User;
                    generalDataService.RequestLanguage = requestGeneralData.RequestLanguage;
                    generalDataService.RequestLanguageId = requestGeneralData.RequestLanguageId;
                    generalDataService.RequestRoute = requestGeneralData.RequestRoute;
                }
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 401;
                return;
            }
            await _next(context);
        }
    }
}