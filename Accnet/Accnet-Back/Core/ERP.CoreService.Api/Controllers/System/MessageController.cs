using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.System
{
    
    [Route("api/system/message")]
    [ApiController]
    public class MessageController: ControllerBase
    {
        private readonly IMessageBiz _messageBiz;

        public MessageController(IMessageBiz messageBiz)
        {
            _messageBiz = messageBiz;
        }

        [HttpPost("count-by-user")]
        public async Task<Result<long>> CountByUser(BaseCoreModel coreModel)
            => await _messageBiz.CountByUser(coreModel.Id.Value);

    }
}