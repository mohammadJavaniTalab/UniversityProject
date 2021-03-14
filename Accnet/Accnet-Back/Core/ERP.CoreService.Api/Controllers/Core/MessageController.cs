using System;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Message;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.Core
{
    
    [Route("api/message")]
    [ApiController]
    public class MessageController: ControllerBase
    {
        private readonly IMessageBiz _messageBiz;

        public MessageController(IMessageBiz messageBiz)
        {
            _messageBiz = messageBiz;
        }

        [HttpPost("add")]
        public Task<Result<Guid>> Add(CreateMessageModel model)
            => _messageBiz.Add(model);


        [HttpPost("get")]
        public async Task<Result<MessageCoreModel>> Get(BaseCoreModel coreModel)
            => await _messageBiz.Get(coreModel);


        [HttpPost("list")]
        public async Task<ResultList<MessageCoreModel>> List(FilterModel model)
            => await _messageBiz.List(model);


        [HttpPost("edit")]
        public async Task<Result<MessageCoreModel>> Edit(UpdateMessageModel model)
            => await _messageBiz.Edit(model);

    }
}