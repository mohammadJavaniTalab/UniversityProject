using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Base;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Invoice;
using ERP.CoreService.Core.Models.Survey;
using ERP.CoreService.Core.Models.UserSurvey;
using ERP.CoreService.DataAccess.EFModels;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.Core
{
    
    [Route("api/user-survey")]
    [ApiController]
    public class UserSurveyController : ControllerBase
    {
        private readonly IUserSurveyBiz _userSurveyBiz;
        private readonly IRepository _repository;

        public UserSurveyController(IUserSurveyBiz userSurveyBiz,IRepository repository)
        {
            _repository = repository;
            _userSurveyBiz = userSurveyBiz;
        }

        
        [HttpPost("list")]
        public Task<ResultList<UserSurveyModel>> List(FilterModel model)
            => _userSurveyBiz.List(model);

        [HttpPost("delete")]
        public Task<Result> Delete([FromQuery] Guid userId,[FromQuery] Guid surveyId)
            => _userSurveyBiz.Delete(userId,surveyId);


        [HttpPost("answer-question")]
        public async Task<Result<UserSurveyModel>> Answer(SurveyAnswerModel model)
            => await _userSurveyBiz.Answer(model);

        [HttpPost("next-question")]
        public async Task<Result<UserAnswerModel>> NextQuestion(BaseCoreModel coreModel)
            => await _userSurveyBiz.NextQuestion(coreModel);

        [HttpPost("previous-question")]
        public async Task<Result<UserAnswerModel>> PreviousQuestion(BaseCoreModel coreModel)
            => await _userSurveyBiz.PreviousQuestion(coreModel);

        [HttpPost("specific-questions")]
        public async Task<Result<IList<ExceptionQuestionModel>>> SpecificQuestionAnswers([FromQuery] Guid surveyId)
            => await _userSurveyBiz.SpecificQuestionAnswers(new BaseCoreModel{Id = surveyId});

        [HttpPost("specific-answers")]
        public async Task<Result<UserAnswerModel>> SpecificAnswers(ExceptionAnswerModel model)
            => await _userSurveyBiz.SpecificAnswers(model);

        [HttpPost("pay-now")]
        public async Task<Result<InvoiceCoreModel>> SurveyAction([FromQuery] Guid surveyId)
        { 
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);

            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(userId, surveyId);

            var invoice = await _repository.FirstOrDefaultAsync<Invoice>(i =>
                i.UserSurvey.Any() && i.UserSurvey.FirstOrDefault().Id == usersurvey.Data.Id,i=>i.UserSurvey.Select(u=>u.Tax));


            invoice.Data.Enabled = true;
            invoice.Data.PaypalOrder=new PaypalOrder
            {
                Id = Guid.NewGuid(),
                Amount = 0,
                Status = "#",
                ApproveLink = "",
                CaptureLink = "",
                OrderId = ""
            };
            invoice.Data.UserSurvey.FirstOrDefault().Tax.ToList().ForEach(t=>t.Status=(int) TaxStatus.PaymentPending);

            await _repository.CommitAsync();

            return Result<InvoiceCoreModel>.Successful(new InvoiceCoreModel
            {
                Id = invoice.Data.Id,
                Amount = invoice.Data.Amount,
                Title = invoice.Data.Title,
                Description = invoice.Data.Description,
                Status = (InvoiceStatus) invoice.Data.Status,
                Enabled = invoice.Data.Enabled,
            });
        }

    }
}