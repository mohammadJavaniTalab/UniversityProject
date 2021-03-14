using System;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Tax;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.Core
{
    
    [Route("api/tax")]
    [ApiController]
    public class TaxController: ControllerBase
    {
        private readonly ITaxBiz _taxBiz;

        public TaxController(ITaxBiz taxBiz)
        {
            _taxBiz = taxBiz;
        }

        [HttpPost("add")]
        public Task<Result<Guid>> Add(CreateTaxModel model)
            => _taxBiz.Add(model);


        [HttpPost("get")]
        public async Task<Result<TaxCoreModel>> Get(BaseCoreModel coreModel)
            => await _taxBiz.Get(coreModel);


        [HttpPost("list")]
        public async Task<ResultList<SurveyTaxModel>> List(FilterModel model)
            => await _taxBiz.List(model);


        [HttpPost("edit")]
        public async Task<Result<TaxCoreModel>> Edit(UpdateTaxModel model)
            => await _taxBiz.Edit(model);

    }
}