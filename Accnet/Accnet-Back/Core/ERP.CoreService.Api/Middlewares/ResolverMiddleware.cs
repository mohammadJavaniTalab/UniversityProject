using System;
using System.Linq;
using System.Threading.Tasks;
using CoreLib.Services;
using CoreLib.Services.Models;
using Microsoft.AspNetCore.Http;

namespace ERP.CoreService.Api.Middlewares
{
    public class ResolverMiddleware
    {
        private readonly RequestDelegate _next;

        public ResolverMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            var generalDataService =
                (IGeneralDataService) context.RequestServices.GetService(typeof(IGeneralDataService));
            if (context.User.Claims.Any())
            {
                var claims = context.User.Claims;
                generalDataService.User = new User()
                {
                    Id = new Guid(claims.FirstOrDefault(c => c.Type == "Id").Value),
                    // FirstName = claims.FirstOrDefault(c => c.Type == "FirstName").Value,
                    Lastname = claims.FirstOrDefault(c => c.Type == "Lastname").Value,
                    RoleId = new Guid(claims.FirstOrDefault(c => c.Type == "RoleId").Value),
                    Enabled = claims.FirstOrDefault(c => c.Type == "Enabled").Value == "True",
                    Email = claims.FirstOrDefault(c => c.Type == "Email").Value,
                    Mobile = claims.FirstOrDefault(c => c.Type == "Mobile").Value,
                    Username = claims.FirstOrDefault(c => c.Type == "Username").Value,
                    Permissions = claims.Any(c => c.Type == "PermissionsId" && !string.IsNullOrWhiteSpace(c.Value))
                        ? claims.FirstOrDefault(c => c.Type == "PermissionsId").Value.TrimEnd(',').Split(',')
                            .Select(s => Convert.ToInt32(s)).ToList()
                        : null
                };
            }
            await _next(context);
        }
    }
}