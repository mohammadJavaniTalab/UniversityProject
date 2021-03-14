using CoreLib;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ERP.MembershipService.Api.Middlewares
{
    /// <summary>
    ///  OnExceptionMiddleware , Produce Custom message during Internal Server Exception
    /// </summary>
    public class OnExceptionMiddleware : IExceptionFilter
    {
        /// <inheritdoc />
        public void OnException(ExceptionContext context)
        {
            
            context.Result = new ObjectResult(Result.Failed(Error.WithData(1000,
                new[] {context.Exception.Message, context.Exception.StackTrace})))
            {
                
                StatusCode = 200
            };
        }
    }
}