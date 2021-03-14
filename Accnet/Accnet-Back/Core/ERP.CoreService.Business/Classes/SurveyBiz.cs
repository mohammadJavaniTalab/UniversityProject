using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Models;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Core.Base;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Survey;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Enums;

namespace ERP.CoreService.Business.Classes
{
    public class SurveyBiz : Base, ISurveyBiz
    {
        private readonly IRepository _repository;
        private readonly IMembershipServiceApi _membershipServiceApi;

        public SurveyBiz(IMapperService mapper, IRepository repository, IMembershipServiceApi membershipServiceApi,
            IMapper autoMapper,
            ILogger logger, IGeneralDataService generalDataService) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _membershipServiceApi = membershipServiceApi;
            _repository = repository;
        }

        public Task<Result<Guid>> Add(CreateSurveyModel model)
            => Result<Guid>.TryAsync(async () =>
            {
                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);
                if (!isAdmin)
                    return Result<Guid>.Failed(Error.WithData(1000,new []{"not admin"}));
                var validationCheckbox = true;
                var survey = new Survey
                {
                    Id = Guid.NewGuid(),
                    Name = model.Name,
                    Description = model.Description,
                    CreatedBy = generalDataService.User.Id,
                    CreationDate = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    Enabled = model.Enabled.Value,
                    Question = model.Questions.Select(q =>
                    {
                        if (q.Answers.Any(a => a.Type == AnswerType.Checkbox) && q.MustAnsweredNumber != null &&
                            q.MustAnsweredNumber.Any())
                            validationCheckbox = false;
                        return new Question
                        {
                            Id = Guid.NewGuid(),
                            Text = q.Text,
                            ModifiedDate = DateTime.Now,
                            Number = q.Number,
                            Answer = q.Answers.Select(a => new Answer
                            {
                                Id = Guid.NewGuid(),
                                Text = a.Text,
                                ModifiedDate = DateTime.Now,
                                Type = (byte) a.Type,
                                Number = a.Number,
                                Action = a.Actions?.Select(action => new DataAccess.EFModels.Action
                                        {Id = Guid.NewGuid(), Type = (byte) action.Type, Value = action.Value})
                                    .ToList(),
                            }).ToList()
                        };
                    }).ToList()
                };

                if(!validationCheckbox)
                    return Result<Guid>.Failed(Error.WithData(1000,new []{"must answer questions cant have checkbox answers"}));
                survey.Question?.ToList().ForEach(question =>
                {
                    var mustAnsweredNumber = model.Questions?.FirstOrDefault(q => q.Number == question.Number)?
                        .MustAnsweredNumber;

                    question.MustAnswered = survey.Question.SelectMany(q => q.Answer)
                        .Where(a => mustAnsweredNumber != null && mustAnsweredNumber.Contains(a.Number)).Select(ma =>
                            new MustAnswered
                                {Id = Guid.NewGuid(), AnswerId = ma.Id, QuestionId = question.Id}).ToList();
                });
                _repository.Add(survey);
                await _repository.CommitAsync();

                return Result<Guid>.Successful(survey.Id);
            });

        public Task<Result<SurveyCoreModel>> Get(BaseCoreModel coreModel)
            => Result<SurveyCoreModel>.TryAsync(async () =>
            {
                var result = await _repository.FirstOrDefaultAsNoTrackingAsync<Survey>(s => s.Id == coreModel.Id,
                    s => s.Question.Select(
                        q => q.Answer.Select(a => a.Action)),
                    s => s.Question.Select(q => q.MustAnswered.Select(ma => ma.Answer)));

                if (!result.Success || result.Data == null)
                    return Result<SurveyCoreModel>.Failed(Error.WithData(1000, new[] {"Survey not found "}));

                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);

                var survey = result.Data;
                var user = await _membershipServiceApi.AuthAuthApiService.Setting(
                    new MembershipService.ApiClient.Models.BaseModel
                        {Id = survey.CreatedBy});
                if (!user.Success || user.Data == null)
                    return Result<SurveyCoreModel>.Failed(Error.WithData(1000, new[] {"User not found "}));

                user.Data.Role = null;
                var surveyModel = new SurveyCoreModel
                {
                    Id = survey.Id,
                    Name = survey.Name,
                    Description = survey.Description,
                    Enabled = survey.Enabled ?? true,
                    CreatedBy = isAdmin ? user.Data : null,
                    Questions = survey.Question.Select(q => new QuestionCoreModel
                    {
                        Id = q.Id,
                        Text = q.Text,
                        Number = q.Number ,
                        MustAnsweredNumber = q.MustAnswered.Select(ma => ma.Answer.Number).ToList(),
                        Answers = q.Answer.Select(a => new AnswerCoreModel
                        {
                            Id = a.Id,
                            Text = a.Text,
                            Number = a.Number ,
                            Type = (AnswerType) a.Type,
                            Actions = a.Action.Select(action => new ActionCoreModel
                            {
                                Id = action.Id,
                                Type = (ActionType) action.Type,
                                Value = action.Value
                            }).ToList()
                        }).ToList()
                    }).ToList()
                };
                return Result<SurveyCoreModel>.Successful(surveyModel);
            });

        public Task<ResultList<SurveyCoreModel>> List(PagingModel model)
            => ResultList<SurveyCoreModel>.TryAsync(async () =>
            {
                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);

                ResultList<Survey> result = null;
                if (isAdmin)
                    result = await _repository.ListAsNoTrackingAsync<Survey>(model,
                        s => s.Question.Select(
                            q => q.Answer.Select(a => a.Action)),
                        s => s.Question.Select(q => q.MustAnswered.Select(ma => ma.Answer)));

                else
                    result = await _repository.ListAsNoTrackingAsync<Survey>(s => s.Enabled != null && s.Enabled.Value,
                        model,
                        s => s.Question.Select(
                            q => q.Answer.Select(a => a.Action)),
                        s => s.Question.Select(q => q.MustAnswered.Select(ma => ma.Answer)));
                if (!result.Success || result.Items == null)
                    return ResultList<SurveyCoreModel>.Failed(Error.WithData(1000, new[] {"Users not found "}));


                var userIds = result.Items.Select(s => s.CreatedBy).ToList();
                var users = await _membershipServiceApi.SystemUserApiService.ListByIds(userIds);
                if (!users.Success || users.Data == null)
                    return ResultList<SurveyCoreModel>.Failed(Error.WithData(1000, new[] {"Users not found "}));

                var surveyModels = result.Items.Select(survey => new SurveyCoreModel
                {
                    Id = survey.Id,
                    Name = survey.Name,
                    Description = survey.Description,
                    Enabled = survey.Enabled ?? true,
                    CreatedBy = isAdmin ? users.Data.FirstOrDefault(u => u.Id == survey.CreatedBy) : null,
                    Questions = survey.Question?.OrderBy(o => o.Number).Select(q => new QuestionCoreModel
                    {
                        Id = q.Id,
                        Text = q.Text,
                        Number = q.Number ,
                        MustAnsweredNumber = q.MustAnswered.Select(ma => ma.Answer.Number).ToList(),
                        Answers = q.Answer?.OrderBy(d => d.Number).Select(a => new AnswerCoreModel
                        {
                            Id = a.Id,
                            Number = a.Number ,
                            Type = (AnswerType) a.Type,
                            Text = a.Text,
                            Actions = a.Action.Select(aa => new ActionCoreModel
                            {
                                Id = aa.Id,
                                Type = (ActionType) aa.Type ,
                                Value = aa.Value
                            }).ToList()
                        }).ToList()
                    }).ToList()
                });
                return ResultList<SurveyCoreModel>.Successful(surveyModels, result.TotalCount, result.PageNumber,
                    result.PageSize);
            });

        public Task<Result<SurveyCoreModel>> Edit(UpdateSurveyModel model)
            => Result<SurveyCoreModel>.TryAsync(async () =>
            {
                var userSurvey =
                    await _repository.FirstOrDefaultAsNoTrackingAsync<UserSurvey>(us => us.SurveyId == model.Id);

                var result = await _repository.FirstOrDefaultAsync<Survey>(s => s.Id == model.Id,
                    s => s.Question.Select(
                        q => q.Answer.Select(a => a.Action)));

                if (!result.Success || result.Data == null)
                    return Result<SurveyCoreModel>.Failed(Error.WithData(1000, new[] {"Survey not found "}));

                var survey = result.Data;

                if (survey.Enabled != model.Enabled)
                {
                    survey.Enabled = model.Enabled;
                    survey.Name = model.Name;
                    survey.Description = model.Description;
                    if (userSurvey.Success && userSurvey.Data != null)
                    {
                        await _repository.CommitAsync();
                        return Result<SurveyCoreModel>.Failed(Error.WithData(1000,
                            new[] {"After a Survey done by user ! you cant edit survey , only enable or disable would work "}));

                    }

                }
                     
                

                _repository.RemoveRange(survey.Question.SelectMany(q => q.Answer.SelectMany(a => a.Action)).ToList());
                _repository.RemoveRange(survey.Question.SelectMany(q => q.Answer.SelectMany(a => a.MustAnswered))
                    .ToList());
                _repository.RemoveRange(survey.Question.SelectMany(q => q.MustAnswered).ToList());
                _repository.RemoveRange(survey.Question.SelectMany(q => q.Answer).ToList());
                _repository.RemoveRange(survey.Question);
                survey.Question = model.Questions.Select(q =>
                {
                    var questionId = Guid.NewGuid();
                    return new Question
                    {
                        Id = questionId,
                        Text = q.Text,
                        Number = q.Number,
                        Answer = q.Answers.Select(a => new Answer
                        {
                            Id = Guid.NewGuid(),
                            Number = a.Number,
                            Type = (byte) a.Type,
                            QuestionId = questionId,
                            Text = a.Text,
                            Action = a.Actions.Select(action => new DataAccess.EFModels.Action
                                    {Id = Guid.NewGuid(), Type = (byte) action.Type, Value = action.Value})
                                .ToList(),
                        }).ToList()
                    };
                }).ToList();

                survey.Question?.ToList().ForEach(question =>
                {
                    var mustAnsweredNumber = model.Questions?.FirstOrDefault(q => q.Number == question.Number)?
                        .MustAnsweredNumber.Where(a => question.Number - a > 0).ToList();

                    question.MustAnswered = survey.Question.SelectMany(q => q.Answer)
                        .Where(a => mustAnsweredNumber != null && mustAnsweredNumber.Contains(a.Number)).Select(ma =>
                            new MustAnswered
                                {Id = Guid.NewGuid(), AnswerId = ma.Id, QuestionId = question.Id}).ToList();
                });

                survey.Enabled = model.Enabled;
                survey.Name = model.Name;
                survey.Description = model.Description;
                await _repository.CommitAsync();
                return Result<SurveyCoreModel>.Successful(_autoMapper.Map<SurveyCoreModel>(survey));
            });
    }
}