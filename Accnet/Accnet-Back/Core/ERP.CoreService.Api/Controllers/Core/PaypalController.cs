using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Invoice;
using ERP.CoreService.Core.Models.Paypal;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.Core
{
    
    [Route("api/message")]
    [ApiController]
    public class PaypalController
    {

        private readonly IPaypalBiz _paypalBiz;

        public PaypalController(IPaypalBiz paypalBiz)
        {
            _paypalBiz = paypalBiz;
        }
        
        [HttpPost("create-order")]
        public Task<Result<string>> Add(BaseCoreModel coreModel)
            => _paypalBiz.CreateOrder(coreModel);


        [HttpPost("capture-order")]
        public async Task<Result<InvoiceCoreModel>> CaptureOrder(CaptureOrderModel model)
            => await _paypalBiz.CaptureOrder(model);
        
    }
}