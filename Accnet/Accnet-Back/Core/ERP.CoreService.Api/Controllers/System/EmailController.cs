using ERP.CoreService.Business.Services.Email;
using ERP.CoreService.Business.Services.Sms;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.System
{
    [Route("api/system/email")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly CoreSmtpClient _coreSmtpClient;
        private readonly SmsHttpClient _smsHttpClient;

        public EmailController(CoreSmtpClient coreSmtpClient,SmsHttpClient smsHttpClient)
        {
            _smsHttpClient = smsHttpClient;
            _coreSmtpClient = coreSmtpClient;
        }

//        [HttpPost("send")]
//        public Result<> Send(SendEmailRequest model)
//            => _coreSmtpClient.Send(model.Email, model.Body, model.Subject);
        
    }
}