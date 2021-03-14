using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using CoreLib;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ERP.CoreService.Api.Filters
{
    public class ModelValidationFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var parameters = context.ActionDescriptor.Parameters;
            if (parameters.Count < 1 || !parameters.First().ParameterType.Namespace.Contains("ERP") ||
                (context.HttpContext.Request.Headers.ContainsKey("api-key") && context.HttpContext.Request.Headers.ContainsKey("api-name")))
            {
                await next();
                return;
            }
            
            var validateResult = ValidateModel(context.ActionArguments.Count > 0 ? context.ActionArguments.First().Value : null);
            if (!validateResult.Success)
            {
                var serializerService = (ISerializerService)context.HttpContext.RequestServices.GetService(typeof(ISerializerService));
                context.HttpContext.Response.Headers.Add("content-type", "application-json");
                await context.HttpContext.Response.WriteAsync(serializerService.SerializeToJson(validateResult, new JsonSerializerSettings(){ContractResolver = new CamelCasePropertyNamesContractResolver()}));
                return;
            }

            await next();
        }

        Result ValidateModel(object model)
        {
            if(model == null)
                return Result.Failed(Error.WithCode(BaseErrorCodes.InvalidModel));
            var context = new ValidationContext(model, serviceProvider: null, items: null);
            var results = new List<ValidationResult>();

            return Validator.TryValidateObject(model, context, results, true)
                ? Result.Successful()
                : Result.Failed(Error.WithData(Convert.ToInt32(results.First().ErrorMessage),
                    results.Select(r => r.ErrorMessage).ToArray()));
        }
    }
}