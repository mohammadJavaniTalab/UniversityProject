using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Extentions;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Models;
using ERP.MembershipService.ApiClient.Models.Organization;
using Microsoft.AspNetCore.Mvc;
using FilterModel = ERP.CoreService.Core.Models.FilterModel;

namespace ERP.CoreService.Api.Controllers.Membership
{
    [Route("api/linked-user")]
    [ApiController]
    public class LinkedUserController : ControllerBase
    {
        private readonly IMembershipServiceApi _membershipServiceApi;
        private readonly IRepository _repository;
        private readonly IUserSurveyBiz _userSurveyBiz;

        public LinkedUserController(IMembershipServiceApi membershipServiceApi, IUserSurveyBiz userSurveyBiz,
            IRepository repository)
        {
            _userSurveyBiz = userSurveyBiz;
            _repository = repository;
            _membershipServiceApi = membershipServiceApi;
        }

        [HttpPost("add")]
        public async Task<Result<Guid>> Add(CreateLinkedUserModel model)
            => await _membershipServiceApi.MembershipLinkedUserApiService.Add(model);

        [HttpPost("get")]
        public async Task<Result<LinkedUserModel>> Get(CoreService.Core.Models.BaseCoreModel coreModel)
            => await _membershipServiceApi.MembershipLinkedUserApiService.Get(new BaseModel {Id = coreModel.Id});

        [HttpPost("list")]
        public async Task<ResultList<LinkedUserModel>> List(FilterModel model)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            model.Id = userId;
            return await _membershipServiceApi.MembershipLinkedUserApiService.List(model.ToMembershipFilterModel());
        }

        [HttpPost("list-by-user")]
        public async Task<Result<IList<LinkedUserModel>>> ListByUser(CoreService.Core.Models.BaseCoreModel coreModel)
            => await _membershipServiceApi.MembershipLinkedUserApiService.ListByUser(new BaseModel {Id = coreModel.Id});

        [HttpPost("join-request")]
        public async Task<Result> JoinRequest(CreateLinkedUserModel model)
            => await _membershipServiceApi.MembershipLinkedUserApiService.JoinRequest(model);

        [HttpPost("survey-join-request")]
        public async Task<Result> SurveyJoinRequest([FromQuery] Guid surveyId, CreateLinkedUserModel model)
        {
            var joinRequest = await _membershipServiceApi.MembershipLinkedUserApiService.JoinRequest(model);

            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);

            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(userId, surveyId);

            var userDependentSurvey = new UserDependentSurvey
            {
                Id = Guid.NewGuid(),
                UserId = model.FirstUserId.Value,
                UserSurveyId = usersurvey.Data.Id
            };
            _repository.Add(userDependentSurvey);
           await _repository.CommitAsync();
           return Result.Successful();
        }

        [HttpPost("accept-request")]
        public async Task<Result> AcceptRequest(CoreService.Core.Models.BaseCoreModel coreModel)
            => await _membershipServiceApi.MembershipLinkedUserApiService.AcceptRequest(new BaseModel {Id = coreModel.Id});

        [HttpPost("edit")]
        public async Task<Result<LinkedUserModel>> Edit(UpdateLinkedUserModel model)
            => await _membershipServiceApi.MembershipLinkedUserApiService.Edit(model);
    }
}