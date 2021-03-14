using System;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Ticket;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.Core
{
    
    [Route("api/Ticket")]
    [ApiController]
    public class TicketController: ControllerBase
    {
        private readonly ITicketBiz _ticketBiz;

        public TicketController(ITicketBiz ticketBiz)
        {
            _ticketBiz = ticketBiz;
        }

        [HttpPost("add")]
        public Task<Result<Guid>> Add(CreateTicketModel model)
            => _ticketBiz.Add(model);


        [HttpPost("get")]
        public async Task<Result<TicketCoreModel>> Get(BaseCoreModel coreModel)
            => await _ticketBiz.Get(coreModel);


        [HttpPost("list")]
        public async Task<ResultList<TicketCoreModel>> List(FilterModel model)
            => await _ticketBiz.List(model);


        [HttpPost("edit")]
        public async Task<Result<TicketCoreModel>> Edit(UpdateTicketModel model)
            => await _ticketBiz.Edit(model);
    }
}