using System;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Tax;
using ERP.CoreService.DataAccess.EFModels;

namespace ERP.CoreService.Business.Interfaces
{
    public interface ITaxBiz
    {
        Task<Result<TaxCoreModel>> Edit(UpdateTaxModel model);
        Task<ResultList<SurveyTaxModel>> List(FilterModel model);
        Task<Result<TaxCoreModel>> Get(BaseCoreModel coreModel);
        Task<Result<Guid>> Add(CreateTaxModel model,UserSurvey userSurvey=null);

        Task<Result<long>> CountByUser(Guid userId);
        Task<Result> AddForSurvey(CreateTaxModel createTaxModel, UserSurvey userSurvey);
    }
}