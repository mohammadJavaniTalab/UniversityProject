using System;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Survey;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.Core
{
    [Route("api/survey")]
    [ApiController]

    public class SurveyController : ControllerBase
    {
        private readonly ISurveyBiz _surveyBiz;

        public SurveyController(ISurveyBiz surveyBiz)
        {
            _surveyBiz = surveyBiz;
        }

        
        [HttpPost("add")]
        public Task<Result<Guid>> Add(CreateSurveyModel model)
            => _surveyBiz.Add(model);


        [HttpPost("get")]
        public async Task<Result<SurveyCoreModel>> Get(BaseCoreModel coreModel)
            => await _surveyBiz.Get(coreModel);


        [HttpPost("list")]
        public async Task<ResultList<SurveyCoreModel>> List(PagingModel model)
            => await _surveyBiz.List(model);


        [HttpPost("edit")]
        public async Task<Result<SurveyCoreModel>> Edit(UpdateSurveyModel model)
            => await _surveyBiz.Edit(model);

    }
}