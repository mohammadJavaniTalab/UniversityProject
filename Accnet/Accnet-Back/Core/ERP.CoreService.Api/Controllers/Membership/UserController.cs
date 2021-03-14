using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Business.Services.Google;
using ERP.CoreService.Core.Extentions;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.User;
using ERP.CoreService.Core.Models.UserSurvey;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Enums;
using ERP.MembershipService.ApiClient.Models;
using ERP.MembershipService.ApiClient.Models.Organization;
using ERP.MembershipService.ApiClient.Models.User;
using Microsoft.AspNetCore.Mvc;
using FilterModel = ERP.CoreService.Core.Models.FilterModel;

namespace ERP.CoreService.Api.Controllers.Membership
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMembershipServiceApi _membershipServiceApi;
        private readonly IUserSurveyBiz _userSurveyBiz;
        private readonly PlaceApi _placeApi;
        private readonly IRepository _repository;

        public UserController(IMembershipServiceApi membershipServiceApi, IRepository repository,
            IUserSurveyBiz userSurveyBiz,
            PlaceApi placeApi)
        {
            _repository = repository;
            _placeApi = placeApi;
            _userSurveyBiz = userSurveyBiz;
            _membershipServiceApi = membershipServiceApi;
        }

        [HttpPost("add")]
        public async Task<Result<Guid>> Add([FromQuery] string placeid, CreateUserModel model)
        {
            var placeDetail = await _placeApi.PlaceDetail(placeid);
            if (placeDetail.Success)
            {
                model.Province = placeDetail.Data.Item1;
                model.City = placeDetail.Data.Item2;
                model.PostalCode = placeDetail.Data.Item3;
                model.Address = placeDetail.Data.Item4;
            }

            return await _membershipServiceApi.MembershipUserApiService.Add(model);
        }


        [HttpPost("survey-dependents/list-by-user")]
        public async Task<Result<IList<LinkedUserModel>>> SurveyDependentsListByUser([FromQuery] Guid surveyId)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(userId, surveyId);

            var result = await _repository.ListAsNoTrackingAsync<UserDependentSurvey>(
                uas => uas.UserSurveyId == usersurvey.Data.Id);
            if (!result.Success || result.Data == null || !result.Data.Any())
                return Result<IList<LinkedUserModel>>.Successful(new List<LinkedUserModel>());
            var dependentsId = result.Data.Select(r => r.UserId).ToList();

            var linkedUsers = await _membershipServiceApi.MembershipLinkedUserApiService.ListByUser(
                new MembershipService.ApiClient.Models.BaseModel
                {
                    Id = userId
                });
            if (!linkedUsers.Success || linkedUsers.Data == null || !linkedUsers.Data.Any())
                return Result<IList<LinkedUserModel>>.Successful(new List<LinkedUserModel>());
            linkedUsers.Data = linkedUsers.Data.Where(ld => dependentsId.Contains(ld.FirstUser.Id.Value)).ToList();
            linkedUsers.Data = linkedUsers.Data.Where(ld => !ld.RelationType.ToLower().Contains("spouse")).ToList();
            return Result<IList<LinkedUserModel>>.Successful(linkedUsers.Data);
        }

        [HttpPost("survey-dependents/get-spouse")]
        public async Task<Result<LinkedUserModel>> GetSpouse([FromQuery] Guid surveyId)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(userId, surveyId);

            var result = await _repository.ListAsNoTrackingAsync<UserDependentSurvey>(
                uas => uas.UserSurveyId == usersurvey.Data.Id);
            if (!result.Success || result.Data == null || !result.Data.Any())
                return Result<LinkedUserModel>.Successful(null);
            var dependentsId = result.Data.Select(r => r.UserId).ToList();

            var linkedUsers = await _membershipServiceApi.MembershipLinkedUserApiService.ListByUser(
                new MembershipService.ApiClient.Models.BaseModel
                {
                    Id = userId
                });
            if (!linkedUsers.Success || linkedUsers.Data == null || !linkedUsers.Data.Any())
                return Result<LinkedUserModel>.Successful(null);
            linkedUsers.Data = linkedUsers.Data.Where(ld => dependentsId.Contains(ld.FirstUser.Id.Value)).ToList();
            return Result<LinkedUserModel>.Successful(
                linkedUsers.Data.FirstOrDefault(l => l.RelationType.ToLower() == "spouse"));
        }


        [HttpPost("survey-dependent/add")]
        public async Task<Result<Guid>> AddSurveyDependent(CreateUserDependentModel model)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(userId, model.SurveyId);
            var id = Guid.NewGuid();

            var duplicate = await _repository.FirstOrDefaultAsNoTrackingAsync<UserDependentSurvey>(d =>
                d.UserId == model.UserId && d.UserSurveyId == usersurvey.Data.Id);
            if (duplicate.Success && duplicate.Data != null)
                return Result<Guid>.Successful(duplicate.Data.Id);

            var linkedUsers =
                await _membershipServiceApi.MembershipLinkedUserApiService.ListByUser(new BaseModel {Id = userId});
            if (linkedUsers.Data != null && linkedUsers.Data.Any() &&
                linkedUsers.Data.Any(l => l.FirstUser.Id == model.UserId))
            {
                var userDependentSurvey = new UserDependentSurvey
                {
                    Id = Guid.NewGuid(),
                    UserId = model.UserId,
                    TuitionFee = model.TuitionFee,
                    UserSurveyId = usersurvey.Data.Id
                };
                _repository.Add(userDependentSurvey);
                await _repository.CommitAsync();
                return Result<Guid>.Successful(userDependentSurvey.Id);
            }

            var joinRequest = await _membershipServiceApi.MembershipLinkedUserApiService.JoinRequest(
                new CreateLinkedUserModel
                {
                    FirstUserId = model.UserId,
                    SecondUserId = userId,
                    RelationType = model.RelationType
                });
            if (joinRequest.Success)
            {
                var dependent = new UserDependentSurvey
                {
                    Id = Guid.NewGuid(),
                    UserId = model.UserId,
                    UserSurveyId = usersurvey.Data.Id
                };
                _repository.Add(dependent);
                await _repository.CommitAsync();
                return Result<Guid>.Successful(dependent.Id);
            }

            return Result<Guid>.Failed(joinRequest.Error);
        }

        [HttpPost("survey-dependents/delete")]
        public async Task<Result> DeleteSurveyDependents([FromQuery] Guid surveyId, [FromQuery] Guid linkedUserId)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(userId, surveyId);

            var linkedUsers =
                await _membershipServiceApi.MembershipLinkedUserApiService.ListByUser(new BaseModel {Id = userId});

            var dependentId = linkedUsers.Data.FirstOrDefault(l => l.Id.Value == linkedUserId).FirstUser.Id;

            var result = await _repository.FirstOrDefaultAsync<UserDependentSurvey>(u =>
                u.UserSurveyId == usersurvey.Data.Id && u.UserId == dependentId);
            if (result.Success || result.Data == null)
                return Result.Failed(Error.WithData(1000, new[]
                {
                    "entity not found"
                }));

            _repository.Remove(result.Data);

            await _repository.CommitAsync();
            return Result.Successful();
        }


        [HttpPost("list")]
        public async Task<ResultList<FullUserModel>> List(FilterModel model)
            => await _membershipServiceApi.MembershipUserApiService.List(model.ToMembershipFilterModel());

        [HttpPost("search")]
        public async Task<Result<LightUserModel>> Search(SearchUserModel model)
        {
            var result = await _membershipServiceApi.MembershipUserApiService.Search(model);
            if (result.Success && result.Data != null)
            {
                var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);

                if (result.Data.Id == userId)
                    return Result<LightUserModel>.Failed(Error.WithData(1000, new[] {"user not found"}));
            }

            return result;
        }

        [HttpPost("edit")]
        public async Task<Result<LightUserModel>> Edit([FromQuery] string placeid, UpdateUserModel model)
        {
            var placeDetail = await _placeApi.PlaceDetail(placeid);
            if (placeDetail.Success)
            {
                model.Province = placeDetail.Data.Item1;
                model.City = placeDetail.Data.Item2;
                model.PostalCode = placeDetail.Data.Item3;
                model.Address = placeDetail.Data.Item4;
            }

            return await _membershipServiceApi.MembershipUserApiService.Edit(model);
        }

        [HttpGet("get")]
        public async Task<Result<FullUserModel>> Get([FromQuery] Guid userId)
        {
            return await _membershipServiceApi.AuthAuthApiService.Profile(new BaseModel
            {
                Id = userId
            });
        }

        [HttpPost("delete")]
        public async Task<Result> Delete(BaseCoreModel coreModel)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);

            var setting = await _membershipServiceApi.AuthAuthApiService.Setting(new BaseModel {Id = userId});
            if (!setting.Data.Role.Name.ToLower().Contains("admin"))
                return Result.Failed(Error.WithData(1000, new[]
                {
                    "you dont have the permission to use this service"
                }));

            await _userSurveyBiz.Delete(coreModel.Id.Value);
            return await _membershipServiceApi.MembershipUserApiService.Delete(
                new MembershipService.ApiClient.Models.BaseModel
                {
                    Id = coreModel.Id
                });
        }


        [HttpPost("survey-dependents/add-spouse")]
        public async Task<Result<object>> Register([FromQuery] Guid surveyId,
            CreateSpouseModel model)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var currentUser = await _membershipServiceApi.AuthAuthApiService.Profile(new BaseModel {Id = userId});
            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(userId, surveyId);

            var dependents =
                await _membershipServiceApi.MembershipLinkedUserApiService.ListByUser(new BaseModel {Id = userId});

            var sp = dependents.Data.FirstOrDefault(ua => ua.RelationType.ToLower().Contains("spouse"));
            if (sp != null)
            {
                var remove =
                    await _membershipServiceApi.MembershipLinkedUserApiService.Remove(new BaseModel {Id = sp.Id});
                var spDependent = await _repository.FirstOrDefaultAsync<UserDependentSurvey>(u =>
                    u.UserSurveyId == usersurvey.Data.Id && userId == sp.FirstUser.Id);
                if (spDependent.Data != null)
                    _repository.Remove(spDependent.Data);
            }

            bool success = false;
            Error error = null;

            Guid spouseId = Guid.Empty;
            if (model.UserId == null)
            {
                var register = await _membershipServiceApi.AuthAuthApiService.Register(new AdvanceRegisterModel
                {
                    SurveyId = surveyId,
                    RelationType = "Spouse",
                    User = new CreateUserModel
                    {
                        Address = currentUser.Data.Address,
                        Province = currentUser.Data.Province,
                        City = currentUser.Data.City,
                        Firstname = model.Firstname,
                        Lastname = model.Lastname,
                        Gender = model.Gender,
                        Mobile = model.Mobile,
                        Email = model.Email,
                        DateOfBirth = model.DateOfBirth,
                        Password = string.IsNullOrEmpty(model.Password) ? "1234" : model.Password,
                        MaritalStatus = MaritalStatus.Married,
                        PostalCode = currentUser.Data.PostalCode,
                        PoBox = currentUser.Data.PoBox,
                        UnitNumber = currentUser.Data.UnitNumber,
                        Receipts = model.Receipts,
                        SinNumber = model.SinNumber,
                        RoleId = new Guid("6C98C773-5CF8-4993-B78B-32AF01858111")
                    }
                });
                success = register.Success;
                if (!success)
                    return Result<object>.Failed(register.Error);
                spouseId = new Guid((string) register.Data);
                error = register.Error;
            }

            else
            {
                var spouse = await _membershipServiceApi.AuthAuthApiService.Profile(new BaseModel {Id = model.UserId});

                var joinRequest = await _membershipServiceApi.MembershipLinkedUserApiService.JoinRequest(
                    new CreateLinkedUserModel
                    {
                        FirstUserId = model.UserId.Value,
                        SecondUserId = userId,
                        RelationType = "Spouse"
                    });
                success = spouse.Success;
                if (!success)
                    return Result<object>.Failed(spouse.Error);

                spouseId = model.UserId.Value;
                error = spouse.Error;
            }

            if (success)
            {
                if (usersurvey.Success)
                {
                    var userDependentSurvey = new UserDependentSurvey
                    {
                        Id = Guid.NewGuid(),
                        UserSurveyId = usersurvey.Data.Id,
                        UserId = spouseId
                    };
                    _repository.Add(userDependentSurvey);
                    await _repository.CommitAsync();
                }


                if (model.Assessments != null && model.Assessments.Any())
                {
                    var id = Guid.NewGuid();
                    var userAssessmentSurvey = new UserAssessmentSurvey
                    {
                        Id = id,
                        UserId = spouseId,
                        UserAssessmentBlob = model.Assessments.Select(b => new UserAssessmentBlob
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

                if (model.ExtraFiles != null && model.ExtraFiles.Any())
                {
                    var id = Guid.NewGuid();
                    var blobs = await _repository.ListAsync<Blob>(b => model.ExtraFiles.Contains(b.Id));
                    blobs.Data.ToList().ForEach(b => b.Title = "Spouse_ExtraFile_" + b.Title);
                    var userAssessmentSurvey = new UserAssessmentSurvey
                    {
                        Id = id,
                        UserId = spouseId,
                        UserAssessmentBlob = model.ExtraFiles.Select(b => new UserAssessmentBlob
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


                return Result<object>.Successful();
            }

            return Result<object>.Failed(error);
        }


        [HttpPost("survey-reciepts/add")]
        public async Task<Result> AddSurveyReciepts(CreateUserAssessmentModel model)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);


            return await _membershipServiceApi.MembershipUserApiService.AddReciept(new UpdateUserModel
                {Id = userId, Receipts = model.BlobIds});
        }


        [HttpPost("survey-assessment/create")]
        public async Task<Result<Guid>> CreateSurveyAssessment(CreateUserAssessmentModel model)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(userId, model.SurveyId);

            var result = await _repository.FirstOrDefaultAsync<UserAssessmentSurvey>(uas =>
                uas.UserId == userId && uas.UserSurveyId == usersurvey.Data.Id &&
                !uas.UserAssessmentBlob.Any(a => !a.Blob.Title.Contains("ExtraFile")), uas => uas.UserAssessmentBlob);
            if (result.Data != null)
            {
                if (result.Data.UserAssessmentBlob != null && result.Data.UserAssessmentBlob.Any())
                    _repository.RemoveRange(result.Data.UserAssessmentBlob);
                _repository.Remove(result.Data);
            }

            if (model.BlobIds != null && model.BlobIds.Any())
            {
                var id = Guid.NewGuid();

                var userAssessmentSurvey = new UserAssessmentSurvey
                {
                    Id = id,
                    UserId = userId,
                    UserSurveyId = usersurvey.Data.Id,
                    UserAssessmentBlob = model.BlobIds.Select(b => new UserAssessmentBlob
                    {
                        Id = Guid.NewGuid(),
                        BlobId = b,
                        UserAssesmentSurveyId = id
                    }).ToList()
                };
                _repository.Add(userAssessmentSurvey);
                await _repository.CommitAsync();
                return Result<Guid>.Successful(id);
            }

            return Result<Guid>.Successful(Guid.NewGuid());
        }


        [HttpPost("survey-assessment/delete")]
        public async Task<Result> DeleteSurveyAssessment([FromQuery] Guid surveyAssessmentId)
        {
            var result = await _repository.FirstOrDefaultAsync<UserAssessmentSurvey>(u => u.Id == surveyAssessmentId);
            if (result.Success || result.Data == null)
                return Result.Failed(Error.WithData(1000, new[]
                {
                    "entity not found"
                }));

            _repository.Remove(result.Data);

            await _repository.CommitAsync();
            return Result.Successful();
        }

        [HttpPost("survey-assessment/list-by-user")]
        public async Task<Result<IList<BlobModel>>> SurveyAssessmentListByUser([FromQuery] Guid surveyId,
            [FromQuery] Guid? userId)
        {
            var currentUserId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);

            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(currentUserId, surveyId);
            if (userId == null)
                userId = currentUserId;

            var result = await _repository.FirstOrDefaultAsNoTrackingAsync<UserAssessmentSurvey>(
                uas => uas.UserSurveyId == usersurvey.Data.Id && uas.UserId == userId,
                uas => uas.UserAssessmentBlob.Select(uab => uab.Blob));
            if (!result.Success || result.Data == null)
                return Result<IList<BlobModel>>.Successful(new List<BlobModel>());
            return Result<IList<BlobModel>>.Successful(result.Data.UserAssessmentBlob.Select(
                uab => new BlobModel {Id = uab.Blob.Id, Name = uab.Blob.Title}).ToList());
        }
    }
}