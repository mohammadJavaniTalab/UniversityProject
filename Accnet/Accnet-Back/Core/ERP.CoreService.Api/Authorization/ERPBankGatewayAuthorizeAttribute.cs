using System;
using CoreLib;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ERP.CoreService.Api.Authorization
{
    public class ERPBankGatewayAuthorizeAttribute : TypeFilterAttribute
    {
        public ERPBankGatewayAuthorizeAttribute() : base(typeof(ERPBankGatewayFilter))
        {
        }
    }

    public class ERPBankGatewayFilter : IAuthorizationFilter
    {
        public ERPBankGatewayFilter()
        {
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                // var repository = (IRepository) context.HttpContext.RequestServices.GetService(typeof(IRepository));
                // var serializerService = (ISerializerService) context.HttpContext.RequestServices.GetService(typeof(ISerializerService));
                // var generalDataService = (IGeneralDataService) context.HttpContext.RequestServices.GetService(typeof(IGeneralDataService));
                // var mappingDataId = context.RouteData.Values["id"].ToString();
                // var mappingData = (repository.FirstOrDefaultAsNoTrackingAsync<MappingData>(m => m.Key == mappingDataId).GetAwaiter().GetResult()).Data;
                // var data = serializerService.DeserializeFromJson<JObject>(mappingData.Value);
                //
                // generalDataService.User =
                //     serializerService.DeserializeFromJson<User>(data["CurrentUser"].ToString());
                // generalDataService.RequestLanguage = data["RequestLanguage"].ToString();
                // generalDataService.RequestLanguageId = new Guid(data["RequestLanguageId"].ToString());
                // generalDataService.Id = string.IsNullOrWhiteSpace(data["GeneralDataId"].ToString()) ? null : (Guid?)new Guid(data["GeneralDataId"].ToString());
            }
            catch (AppException ex)
            {
                context.Result = new UnauthorizedResult();
            }
            catch (Exception ex)
            {
                context.Result = new UnauthorizedResult();
            }
        }
    }
}