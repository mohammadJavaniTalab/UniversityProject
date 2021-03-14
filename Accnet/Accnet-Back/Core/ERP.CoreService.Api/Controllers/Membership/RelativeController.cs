using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Models;
using ERP.MembershipService.ApiClient.Models.Permission;
using ERP.MembershipService.ApiClient.Models.User;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.Membership
{
    [Route("api/relative")]
    [ApiController]
    public class RelativeController : ControllerBase
    {
        private readonly IMembershipServiceApi _membershipServiceApi;
        private readonly IRepository _repository;
        private readonly IUserSurveyBiz _userSurveyBiz;

        public RelativeController(IMembershipServiceApi membershipServiceApi, IUserSurveyBiz userSurveyBiz,
            IRepository repository)
        {
            _userSurveyBiz = userSurveyBiz;
            _repository = repository;
            _membershipServiceApi = membershipServiceApi;
        }

        [HttpPost("list-by-user")]
        public async Task<Result<IList<RelativeModel>>> ListByUser()
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            return await _membershipServiceApi.MembershipRelativeApiService.ListByUser(new BaseModel {Id = userId});
        }

        [HttpGet("list-by-user")]
        public async Task<Result<IList<RelativeModel>>> SurveyRelativeListByUser([FromQuery] Guid surveyId)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);

            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(userId, surveyId);

            var result = await _repository.ListAsNoTrackingAsync<UserRelativeSurvey>(
                uas => uas.UserSurveyId == usersurvey.Data.Id);

            if (!result.Success || result.Data == null || !result.Data.Any())
                return Result<IList<RelativeModel>>.Successful(new List<RelativeModel>());

            var relativeIds = result.Data.Select(r => r.RelativeId).ToList();

            var relatives =
                await _membershipServiceApi.MembershipRelativeApiService.ListByUser(new BaseModel {Id = userId});

            if (!relatives.Success || relatives.Data == null || !relatives.Data.Any())
                return Result<IList<RelativeModel>>.Successful(new List<RelativeModel>());
            relatives.Data = relatives.Data.Where(r => relativeIds.Contains(r.Id)).ToList();
            return Result<IList<RelativeModel>>.Successful(relatives.Data);
        }

        [HttpPost("add")]
        public async Task<Result<Guid>> Add(CreateRelativeModel model)
            => await _membershipServiceApi.MembershipRelativeApiService.Add(model);

        [HttpPost("advance-create")]
        public async Task<Result<Guid>> AdvanceCreate([FromQuery] Guid surveyId, CreateRelativeModel model)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);

            var result = await _membershipServiceApi.MembershipRelativeApiService.Add(model);

            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(userId, surveyId);
            var userRelativeSurvey = new UserRelativeSurvey
            {
                Id = Guid.NewGuid(),
                UserSurveyId = usersurvey.Data.Id,
                RelativeId = result.Data
            };

            _repository.Add(userRelativeSurvey);
            await _repository.CommitAsync();
            return result;
        }

        [HttpPost("delete")]
        public async Task<Result> Delete(BaseModel model)
        {
            var result = await _repository.FirstOrDefaultAsync<UserRelativeSurvey>(r => r.RelativeId == model.Id);
            if (!result.Success || result.Data == null)
                return Result.Failed(Error.WithData(1000, new[] {"entity not found"}));
            _repository.Remove(result.Data);
            await _repository.CommitAsync();
            return Result.Successful();
        }
    }
}