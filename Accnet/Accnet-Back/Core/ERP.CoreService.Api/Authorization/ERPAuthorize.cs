using System;
using System.Linq;
using CoreLib;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Base;
using ERP.MembershipService.ApiClient.Models.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ERP.CoreService.Api.Authorization
{
    public class ERPAuthorizeAttribute : TypeFilterAttribute
    {
        public ERPAuthorizeAttribute(params Permissions[] actionPermission) : base(typeof(ERPAuthorizeFilter))
        {
            Arguments = new object[] {actionPermission};
        }
    }

    public class ERPAuthorizeFilter : IAuthorizationFilter
    {
        Permissions[] actionPermission;

        public ERPAuthorizeFilter(Permissions[] actionPermission)
        {
            this.actionPermission = actionPermission;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                var generalDataService =
                    (IGeneralDataService) context.HttpContext.RequestServices.GetService(typeof(IGeneralDataService));
                if (generalDataService.User == null)
                {
                    context.Result = new UnauthorizedResult();
                    return;
                }

                if (context.HttpContext.User.Claims.Any())
                {
                    var appSetting =
                        (CoreLib.IAppSettings) context.HttpContext.RequestServices.GetService(typeof(CoreLib.IAppSettings));
                    var creationDate = Convert.ToDateTime(context.HttpContext.User.Claims
                        .FirstOrDefault(c => c.Type == "CreationDate").Value);
                
                    if (DateTime.Now >= creationDate.AddMinutes(appSetting.JwtRefreshPeriod))
                    {
                        var authBiz = (IAuthBiz) context.HttpContext.RequestServices.GetService(typeof(IAuthBiz));
                        var user = new FullUserModel
                            {Id = new Guid(context.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "Id").Value)};
                        var result = authBiz.RefreshToken(user).GetAwaiter().GetResult();
                        if (result.Success)
                            context.HttpContext.Response.Headers.Add("new-token", result.Data);
                    }
                }
                
                if (actionPermission == null || actionPermission.Length == 0)
                    return;
                
                if (actionPermission.Any(s => !generalDataService.User.Permissions.Contains((int) s)))
                    context.Result = new ForbidResult();
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