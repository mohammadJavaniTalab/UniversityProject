using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.System
{
    
    [Route("api/system/invoice")]
    [ApiController]
    public class InvoiceController: ControllerBase
    {
        private readonly IInvoiceBiz _invoiceBiz;

        public InvoiceController(IInvoiceBiz invoiceBiz)
        {
            _invoiceBiz = invoiceBiz;
        }

        [HttpPost("count-by-user")]
        public async Task<Result<long>> CountByUser(BaseCoreModel coreModel)
            => await _invoiceBiz.CountByUser(coreModel.Id.Value);

    }
}