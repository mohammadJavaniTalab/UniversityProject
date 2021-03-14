using CoreLib;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;
using CoreLib.Services;

namespace ERP.CoreService.Api.Authorization
{
    public class ServiceAuthorizeAttribute : TypeFilterAttribute
    {
        public ServiceAuthorizeAttribute() : base(typeof(ServiceAuthorizeFilter))
        {
        }
    }
    public class ServiceAuthorizeFilter : IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                var token = context.HttpContext.Request.Headers.FirstOrDefault(h => h.Key == "api-key").Value.First();
                var serviceName = context.HttpContext.Request.Headers.FirstOrDefault(h => h.Key == "api-name").Value.First();
                var authenticateService = (IAuthenticateService)context.HttpContext.RequestServices.GetService(typeof(IAuthenticateService));
                if(!authenticateService.IsValidService(serviceName,token))
                    context.Result = new UnauthorizedResult();
                
                var generalDataService = (IGeneralDataService)context.HttpContext.RequestServices.GetService(typeof(IGeneralDataService));
                generalDataService.RequestRoute = context.HttpContext.Request.Path;
                if (context.HttpContext.Request.Headers.Any(h => h.Key == "general-data"))
                {
                    var serializerService = (ISerializerService)context.HttpContext.RequestServices.GetService(typeof(ISerializerService));
                    var compressionService = (ICompressionService)context.HttpContext.RequestServices.GetService(typeof(ICompressionService));
                    var generalDataString = context.HttpContext.Request.Headers.First(h => h.Key == "general-data").Value.First();
                    generalDataString = compressionService.DecompressGzip(generalDataString);
                    var requestGeneralData = serializerService.DeserializeFromJson<GeneralDataService>(generalDataString);
                    generalDataService.User = requestGeneralData.User;
                    generalDataService.RequestLanguage = requestGeneralData.RequestLanguage;
                    generalDataService.RequestLanguageId = requestGeneralData.RequestLanguageId;
                    generalDataService.RequestRoute = requestGeneralData.RequestRoute;
                    generalDataService.SenderInfo = requestGeneralData.SenderInfo;
                }
            }
            catch (Exception ex)
            {
                context.Result = new UnauthorizedResult();
            }
        }
    }
}
