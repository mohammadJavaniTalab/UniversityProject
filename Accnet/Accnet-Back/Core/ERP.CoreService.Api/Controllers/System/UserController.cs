using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.User;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.System
{
    [Route("api/system/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMessageBiz _messageBiz;
        private readonly ITaxBiz _taxBiz;
        private readonly IUserSurveyBiz _userSurveyBiz;
        private readonly IInvoiceBiz _invoiceBiz;

        public UserController(IMessageBiz messageBiz,ITaxBiz taxBiz,IInvoiceBiz invoiceBiz,IUserSurveyBiz userSurveyBiz)
        {
            _userSurveyBiz = userSurveyBiz;
            _messageBiz = messageBiz;
            _taxBiz = taxBiz;
            _invoiceBiz = invoiceBiz;
        }

        [HttpPost("count-by-user")]
        public Task<Result<UserUncheckedModel>> CountByUser(BaseCoreModel coreModel)
            => Result<UserUncheckedModel>.TryAsync(async () =>
            {
                var unreadMessages = (await _messageBiz.CountByUser(coreModel.Id.Value)).Data;
                var uncheckedTaxes = (await _taxBiz.CountByUser(coreModel.Id.Value)).Data;
                var unpaidInvoices = (await _invoiceBiz.CountByUser(coreModel.Id.Value)).Data;
                var hasDoneSurvey = (await _userSurveyBiz.UserDoneSurvey(coreModel.Id.Value)).Data;

                return Result<UserUncheckedModel>.Successful(new UserUncheckedModel
                {
                    UncheckedTaxes = uncheckedTaxes, UnpaidInvoices = unpaidInvoices, UnreadMessages = unreadMessages,HasDoneSurvey = hasDoneSurvey
                });
            });
    }
}