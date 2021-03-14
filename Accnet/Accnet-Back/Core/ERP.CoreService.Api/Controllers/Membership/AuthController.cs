using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Business.Services.Email;
using ERP.CoreService.Business.Services.Google;
using ERP.CoreService.Business.Services.Sms;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Models;
using ERP.MembershipService.ApiClient.Models.Auth;
using ERP.MembershipService.ApiClient.Models.Organization;
using ERP.MembershipService.ApiClient.Models.User;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using FilterModel = ERP.MembershipService.ApiClient.Models.FilterModel;
using Statistics = ERP.CoreService.Business.Statistics;

namespace ERP.CoreService.Api.Controllers.Membership
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMembershipServiceApi _membershipServiceApi;
        private readonly IUserSurveyBiz _userSurveyBiz;
        private readonly CoreSmtpClient _coreSmtpClient;
        private readonly SmsHttpClient _smsHttpClient;
        private readonly IRepository _repository;
        private readonly PlaceApi _placeApi;
        private readonly Captcha _captcha;

        public AuthController(IMembershipServiceApi membershipServiceApi, CoreSmtpClient coreSmtpClient,
            IUserSurveyBiz userSurveyBiz, IRepository repository, PlaceApi placeApi, Captcha captcha,
            SmsHttpClient smsHttpClient)
        {
            _captcha = captcha;
            _placeApi = placeApi;
            _repository = repository;
            _userSurveyBiz = userSurveyBiz;
            _smsHttpClient = smsHttpClient;
            _coreSmtpClient = coreSmtpClient;
            _membershipServiceApi = membershipServiceApi;
        }

        [HttpPost("generate-token")]
        public async Task<Result<object>> GenerateToken(LoginModel model)
        {
//            var verify = await _captcha.Verify(model.Captcha);
//            if (!verify.Success || !verify.Data)
//                return Result<object>.Failed(Error.WithData(1000, new[] {"captcha not verified"}));
            var result = await _membershipServiceApi.AuthAuthApiService.GenerateToken(model);
            return result;
        }

        [HttpPost("register")]
        public async Task<Result<object>> Register(RegisterModel model)
        {
            var verify = await _captcha.Verify(model.Captcha);
            if (!verify.Success || !verify.Data)
                return Result<object>.Failed(Error.WithData(1000, new[] {"captcha not verified"}));

            var register = await _membershipServiceApi.AuthAuthApiService.Register(model);
            if (register.Success && register.Data != null)
            {
                var body = Statistics.RegisterBody.Replace("####", model.FirstName)
                    .Replace("%Username%", (register.Data as JObject)["username"].ToString())
                    .Replace("%Password%", model.Password);

                _coreSmtpClient.SendRegistrationEmail(model.Email,
                    (register.Data as JObject)["username"].ToString(), model.Password,
                    model.FirstName + " " + model.LastName);
                await _smsHttpClient.Send(model.Mobile, body);
            }

            return register;
        }

        [HttpPost("advanced-register")]
        public async Task<Result<object>> Register([FromQuery] string placeid, [FromQuery] Guid surveyId,
            AdvanceRegisterModel model)
        {
            var placeDetail = await _placeApi.PlaceDetail(placeid);
            if (placeDetail.Success)
            {
                model.User.Province = placeDetail.Data.Item1;
                model.User.City = placeDetail.Data.Item2;
                model.User.PostalCode = placeDetail.Data.Item3;
                model.User.Address = placeDetail.Data.Item4;
            }


            var register = await _membershipServiceApi.AuthAuthApiService.Register(model);

            if (register.Success)
            {
                var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
                var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(userId, model.SurveyId);
                if (usersurvey.Success)
                {
                    var userDependentSurvey = new UserDependentSurvey
                    {
                        Id = Guid.NewGuid(),
                        UserSurveyId = usersurvey.Data.Id,
                        TuitionFee = model.User.TuitionFee,
                        UserId = new Guid((string) register.Data)
                    };
                    _repository.Add(userDependentSurvey);
                }


                if (model.User.Assessments != null && model.User.Assessments.Any())
                {
                    var id = Guid.NewGuid();
                    var userAssessmentSurvey = new UserAssessmentSurvey
                    {
                        Id = id,
                        UserId = new Guid((string) register.Data),
                        UserAssessmentBlob = model.User.Assessments.Select(b => new UserAssessmentBlob
                        {
                            Id = Guid.NewGuid(),
                            BlobId = b,
                            UserAssesmentSurveyId = id
                        }).ToList(),
                        UserSurveyId = usersurvey.Data.Id
                    };
                    _repository.Add(userAssessmentSurvey);
                }

                if (model.User.ExtraFiles != null && model.User.ExtraFiles.Any())
                {
                    var id = Guid.NewGuid();
                    var blobs = await _repository.ListAsync<Blob>(b => model.User.ExtraFiles.Contains(b.Id));
                    blobs.Data.ToList().ForEach(b=>b.Title="Dependent_ExtraFile_"+b.Title);
                    var userAssessmentSurvey = new UserAssessmentSurvey
                    {
                        Id = id,
                        UserId = new Guid((string) register.Data),
                        UserAssessmentBlob = model.User.ExtraFiles.Select(b => new UserAssessmentBlob
                        {
                            Id = Guid.NewGuid(),
                            BlobId = b,
                            UserAssesmentSurveyId = id
                        }).ToList(),
                        UserSurveyId = usersurvey.Data.Id
                    };
                    _repository.Add(userAssessmentSurvey);
                    await _repository.CommitAsync();
                }

                await _repository.CommitAsync();


                return Result<object>.Successful();
            }

            return Result<object>.Failed(register.Error);
        }

        [HttpPost("forgot-password")]
        public async Task<Result> ForgotPassword(SearchUserModel model)
        {
            var result = (await _membershipServiceApi.MembershipUserApiService.Search(model));
            if (result.Data == null)
                return Result.Failed(Error.WithData(1000, new[] {"user not found"}));
            var user = result.Data;

            var password = $"{Guid.NewGuid()}".Substring(0, 5);

            await _membershipServiceApi.AuthAuthApiService.ChangePassword(new ChangePasswordModel
            {
                NewPassword = password, UserId = user.Id.Value,
            });
            var profile = await _membershipServiceApi.AuthAuthApiService.Profile(
                new ERP.MembershipService.ApiClient.Models.BaseModel
                    {Id = user.Id});
            _coreSmtpClient.SendChangePassword(profile.Data.Email, user.Firstname + " " + user.Lastname, user.Username,
                password);

            return Result.Successful();
        }

        [HttpPost("profile")]
        public async Task<Result<FullUserModel>> Profile()
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var result =
                await _membershipServiceApi.AuthAuthApiService.Profile(
                    new ERP.MembershipService.ApiClient.Models.BaseModel {Id = userId});
            try
            {
                var guids = result.Data.Receipts.Select(r => r.Id).ToList();
                var blobs = await _repository.ListAsNoTrackingAsync<Blob>(b => guids.Contains(b.Id));
                result.Data.Receipts.ToList().ForEach(r => r.Name = blobs.Data.FirstOrDefault(b => b.Id == r.Id).Title);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return result;
        }

        [HttpPost("setting")]
        public async Task<Result<LightUserModel>> Setting()
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var result =
                await _membershipServiceApi.AuthAuthApiService.Setting(
                    new ERP.MembershipService.ApiClient.Models.BaseModel {Id = userId});
            return result;
        }

        [HttpPost("change-password")]
        public async Task<Result<bool>> ChangePassword(ChangePasswordModel model)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            model.UserId = userId;
            var result = await _membershipServiceApi.AuthAuthApiService.ChangePassword(model);
            return result;
        }

        [HttpPost("reciepts")]
        public async Task<Result<IList<Guid>>> Reciepts(ChangePasswordModel model)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var result = await _membershipServiceApi.AuthAuthApiService.Reciepts(new BaseModel {Id = userId});
            return result;
        }

        [HttpPost("update-profile")]
        public async Task<Result<LightUserModel>> UpdateProfile([FromQuery] string placeid,
            UpdateUserProfileModel model)
        {
            var placeDetail = await _placeApi.PlaceDetail(placeid);
            if (placeDetail.Success)
            {
                model.Province = placeDetail.Data.Item1;
                model.City = placeDetail.Data.Item2;
                model.PostalCode = placeDetail.Data.Item3;
                model.Address = placeDetail.Data.Item4;
            }

            return await _membershipServiceApi.AuthAuthApiService.UpdateProfile(model);
        }
    }
}