using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.System
{
    
    [Route("api/system/tax")]
    [ApiController]
    public class TaxController: ControllerBase
    {
        private readonly ITaxBiz _taxBiz;

        public TaxController(ITaxBiz taxBiz)
        {
            _taxBiz = taxBiz;
        }


        [HttpPost("count-by-user")]
        public async Task<Result<long>> CountByUser(BaseCoreModel coreModel)
            => await _taxBiz.CountByUser( coreModel.Id.Value);

    }
}