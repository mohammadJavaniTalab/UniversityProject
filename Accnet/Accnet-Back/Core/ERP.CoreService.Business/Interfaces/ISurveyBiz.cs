using System;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Survey;

namespace ERP.CoreService.Business.Interfaces
{
    public interface ISurveyBiz
    {
        Task<Result<Guid>> Add(CreateSurveyModel model);
        Task<Result<SurveyCoreModel>> Get(BaseCoreModel coreModel);
        Task<ResultList<SurveyCoreModel>> List(PagingModel model);
        Task<Result<SurveyCoreModel>> Edit(UpdateSurveyModel model);
    }
}