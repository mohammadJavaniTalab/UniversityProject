using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Survey;
using ERP.CoreService.Core.Models.UserSurvey;
using ERP.CoreService.DataAccess.EFModels;

namespace ERP.CoreService.Business.Interfaces
{
    public interface IUserSurveyBiz
    {
        Task<ResultList<UserSurveyModel>> List(FilterModel model);
        Task<Result<UserSurvey>> GetByUserIdAndSurveyId(Guid userId,Guid surveyId);
        Task<Result<UserSurveyModel>> Answer(SurveyAnswerModel model);
        Task<Result<UserAnswerModel>> NextQuestion(BaseCoreModel coreModel);
        Task<Result<UserAnswerModel>> PreviousQuestion(BaseCoreModel coreModel);
        Task<Result<bool>> UserDoneSurvey(Guid modelId);
        Task<Result> AddDependent(Guid userId,Guid usersurveyId);
        Task<Result> Delete(Guid userId, Guid surveyId);
        Task<Result> Delete(Guid userId);
        Task<Result<IList<ExceptionQuestionModel>>> SpecificQuestionAnswers(BaseCoreModel coreModel);
        Task<Result<UserAnswerModel>> SpecificAnswers( ExceptionAnswerModel model);
    }
}