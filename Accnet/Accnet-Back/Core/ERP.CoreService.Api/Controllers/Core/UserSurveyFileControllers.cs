using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Business.Services.Google;
using ERP.CoreService.Core.Models.User;
using ERP.CoreService.Core.Models.UserSurvey;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Models;
using ERP.MembershipService.ApiClient.Models.User;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.Core
{
    [Route("api/survey-file")]
    [ApiController]
    public class UserSurveyFileControllers : ControllerBase
    {
        private readonly IMembershipServiceApi _membershipServiceApi;
        private readonly IUserSurveyBiz _userSurveyBiz;
        private readonly IRepository _repository;

        public UserSurveyFileControllers(IMembershipServiceApi membershipServiceApi, IRepository repository,
            IUserSurveyBiz userSurveyBiz)
        {
            _repository = repository;
            _userSurveyBiz = userSurveyBiz;
            _membershipServiceApi = membershipServiceApi;
        }

        [HttpPost("reciepts/add")]
        public async Task<Result> AddSurveyReciepts(CreateUserAssessmentModel model)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);


            return await _membershipServiceApi.MembershipUserApiService.AddReciept(new UpdateUserModel
                {Id = userId, Receipts = model.BlobIds});
        }

        [HttpPost("extrafiles/add")]
        public async Task<Result> AddExtraFiles(CreateUserAssessmentModel model)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(userId, model.SurveyId);

            if (model.BlobIds != null && model.BlobIds.Any())
            {
                var id = Guid.NewGuid();

                var blobs = await _repository.ListAsync<Blob>(b => model.BlobIds.Contains(b.Id));
                blobs.Data.ToList().ForEach(b => b.Title = "ExtraFile_" + b.Title);
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

            return Result.Successful();
        }

        [HttpPost("extrafiles/list-by-user")]
        public async Task<Result<IList<BlobModel>>> SurveyExtraFilesListByUser([FromQuery] Guid surveyId,
            [FromQuery] Guid? userId)
        {
            var currentUserId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(currentUserId, surveyId);

            if (userId == null)
                userId = currentUserId;

            var result = await _repository.FirstOrDefaultAsNoTrackingAsync<UserAssessmentSurvey>(
                uas => uas.UserSurveyId == usersurvey.Data.Id && uas.UserId == userId &&
                       uas.UserAssessmentBlob.Any(b => b.Blob.Title.StartsWith("ExtraFile_")),
                uas => uas.UserAssessmentBlob.Select(uab => uab.Blob));

            if (!result.Success || result.Data == null)
                return Result<IList<BlobModel>>.Successful(new List<BlobModel>());

            return Result<IList<BlobModel>>.Successful(result.Data.UserAssessmentBlob.Select(
                uab => new BlobModel {Id = uab.Blob.Id, Name = uab.Blob.Title.Replace("ExtraFile_", "")}
            ).ToList());
        }

        [HttpPost("files/list-by-user")]
        public async Task<Result<KosKeshModel>> KosKesh([FromQuery] Guid surveyId,
            [FromQuery] Guid? userId)
        {
            var currentUserId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(currentUserId, surveyId);

            if (userId == null)
                userId = currentUserId;

            var result = await _repository.FirstOrDefaultAsNoTrackingAsync<UserAssessmentSurvey>(
                uas => uas.UserSurveyId == usersurvey.Data.Id && uas.UserId == userId &&
                       uas.UserAssessmentBlob.Any(b => b.Blob.Title.StartsWith("ExtraFile_")),
                uas => uas.UserAssessmentBlob.Select(uab => uab.Blob));

            var extraFile = new List<BlobModel>();
            if (result.Success && result.Data != null)
                extraFile = result.Data.UserAssessmentBlob.Select(
                    uab => new BlobModel {Id = uab.Blob.Id, Name = uab.Blob.Title.Replace("ExtraFile_", "")}).ToList();
            var profile = await _membershipServiceApi.AuthAuthApiService.Profile(new BaseModel {Id = userId});
            var receipts = profile.Data.Receipts;


            var userassessments = await _repository.FirstOrDefaultAsNoTrackingAsync<UserAssessmentSurvey>(
                uas => !uas.UserAssessmentBlob.Any(b => b.Blob.Title.Contains("ExtraFile_")) &&
                       uas.UserSurveyId == usersurvey.Data.Id && uas.UserId == userId,
                uas => uas.UserAssessmentBlob.Select(uab => uab.Blob));

            var assessments=new List<BlobModel>();
            if (userassessments.Success && userassessments.Data != null) 
                assessments = userassessments.Data?.UserAssessmentBlob?.Select(
                uab => new BlobModel {Id = uab.Blob.Id, Name = uab.Blob.Title}).ToList();

            return Result<KosKeshModel>.Successful(new KosKeshModel
                {Reciepts = receipts.ToList(), Assessments = assessments, ExtraFile = extraFile});
        }


        [HttpPost("child-extrafiles/add")]
        public async Task<Result> AddChildExtraFiles(CreateUserAssessmentModel model)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(userId, model.SurveyId);

            if (model.BlobIds != null && model.BlobIds.Any())
            {
                var id = Guid.NewGuid();

                var blobs = await _repository.ListAsync<Blob>(b => model.BlobIds.Contains(b.Id));
                blobs.Data.ToList().ForEach(b => b.Title = "Child_ExtraFile_" + b.Title);
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

            return Result.Successful();
        }

        [HttpPost("child-extrafiles/list-by-user")]
        public async Task<Result<IList<BlobModel>>> SurveyChildExtraFilesListByUser([FromQuery] Guid surveyId,
            [FromQuery] Guid? userId)
        {
            var currentUserId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(currentUserId, surveyId);

            if (userId == null)
                userId = currentUserId;

            var result = await _repository.FirstOrDefaultAsNoTrackingAsync<UserAssessmentSurvey>(
                uas => uas.UserSurveyId == usersurvey.Data.Id && uas.UserId == userId &&
                       uas.UserAssessmentBlob.Any(b => b.Blob.Title.StartsWith("Child_ExtraFile_")),
                uas => uas.UserAssessmentBlob.Select(uab => uab.Blob));

            if (!result.Success || result.Data == null)
                return Result<IList<BlobModel>>.Successful(new List<BlobModel>());

            return Result<IList<BlobModel>>.Successful(result.Data.UserAssessmentBlob.Select(
                uab => new BlobModel {Id = uab.Blob.Id, Name = uab.Blob.Title.Replace("Child_ExtraFile_", "")}
            ).ToList());
        }


        [HttpPost("medical-extrafiles/add")]
        public async Task<Result> AddMedicalExtraFiles(CreateUserAssessmentModel model)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(userId, model.SurveyId);

            if (model.BlobIds != null && model.BlobIds.Any())
            {
                var id = Guid.NewGuid();

                var blobs = await _repository.ListAsync<Blob>(b => model.BlobIds.Contains(b.Id));
                blobs.Data.ToList().ForEach(b => b.Title = "Medical_ExtraFile_" + b.Title);
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

            return Result.Successful();
        }

        [HttpPost("medical-extrafiles/list-by-user")]
        public async Task<Result<IList<BlobModel>>> SurveyMedicalExtraFilesListByUser([FromQuery] Guid surveyId,
            [FromQuery] Guid? userId)
        {
            var currentUserId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(currentUserId, surveyId);

            if (userId == null)
                userId = currentUserId;

            var result = await _repository.FirstOrDefaultAsNoTrackingAsync<UserAssessmentSurvey>(
                uas => uas.UserSurveyId == usersurvey.Data.Id && uas.UserId == userId &&
                       uas.UserAssessmentBlob.Any(b => b.Blob.Title.StartsWith("Medical_ExtraFile_")),
                uas => uas.UserAssessmentBlob.Select(uab => uab.Blob));

            if (!result.Success || result.Data == null)
                return Result<IList<BlobModel>>.Successful(new List<BlobModel>());

            return Result<IList<BlobModel>>.Successful(result.Data.UserAssessmentBlob.Select(
                uab => new BlobModel {Id = uab.Blob.Id, Name = uab.Blob.Title.Replace("Medical_ExtraFile_", "")}
            ).ToList());
        }
        
        
        [HttpPost("selfemployed-extrafiles/add")]
        public async Task<Result> AddselfemployedExtraFiles(CreateUserAssessmentModel model)
        {
            var userId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(userId, model.SurveyId);

            if (model.BlobIds != null && model.BlobIds.Any())
            {
                var id = Guid.NewGuid();

                var blobs = await _repository.ListAsync<Blob>(b => model.BlobIds.Contains(b.Id));
                blobs.Data.ToList().ForEach(b => b.Title = "SelfEmployed_ExtraFile_" + b.Title);
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

            return Result.Successful();
        }

        [HttpPost("selfemployed-extrafiles/list-by-user")]
        public async Task<Result<IList<BlobModel>>> SurveyselfemployedExtraFilesListByUser([FromQuery] Guid surveyId,
            [FromQuery] Guid? userId)
        {
            var currentUserId = new Guid(User.Claims.FirstOrDefault(c => c.Type == "Id").Value);
            var usersurvey = await _userSurveyBiz.GetByUserIdAndSurveyId(currentUserId, surveyId);

            if (userId == null)
                userId = currentUserId;

            var result = await _repository.FirstOrDefaultAsNoTrackingAsync<UserAssessmentSurvey>(
                uas => uas.UserSurveyId == usersurvey.Data.Id && uas.UserId == userId &&
                       uas.UserAssessmentBlob.Any(b => b.Blob.Title.StartsWith("SelfEmployed_ExtraFile_")),
                uas => uas.UserAssessmentBlob.Select(uab => uab.Blob));

            if (!result.Success || result.Data == null)
                return Result<IList<BlobModel>>.Successful(new List<BlobModel>());

            return Result<IList<BlobModel>>.Successful(result.Data.UserAssessmentBlob.Select(
                uab => new BlobModel {Id = uab.Blob.Id, Name = uab.Blob.Title.Replace("SelfEmployed_ExtraFile_", "")}
            ).ToList());
        }


        [HttpPost("assessment/create")]
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


        [HttpPost("assessment/delete")]
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

        [HttpPost("assessment/list-by-user")]
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