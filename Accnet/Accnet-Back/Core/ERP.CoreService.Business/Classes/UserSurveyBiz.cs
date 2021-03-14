using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Business.Services.Email;
using ERP.CoreService.Business.Services.Sms;
using ERP.CoreService.Core.Base;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Invoice;
using ERP.CoreService.Core.Models.Message;
using ERP.CoreService.Core.Models.Survey;
using ERP.CoreService.Core.Models.Tax;
using ERP.CoreService.Core.Models.Ticket;
using ERP.CoreService.Core.Models.UserSurvey;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Enums;
using Microsoft.EntityFrameworkCore.Internal;

namespace ERP.CoreService.Business.Classes
{
    public class UserSurveyBiz : Base, IUserSurveyBiz
    {
        private readonly IRepository _repository;
        private readonly IMembershipServiceApi _membershipServiceApi;
        private readonly ITicketBiz _ticketBiz;
        private readonly IMessageBiz _messageBiz;
        private readonly CoreSmtpClient _coreSmtpClient;
        private readonly SmsHttpClient _smsHttpClient;
        private readonly IInvoiceBiz _invoiceBiz;
        private readonly ITaxBiz _taxBiz;

        public UserSurveyBiz(IMapperService mapper, IRepository repository, IMapper autoMapper,
            SmsHttpClient smsHttpClient, IInvoiceBiz invoiceBiz, IMessageBiz messageBiz, ITaxBiz taxBiz,
            IMembershipServiceApi membershipServiceApi, ITicketBiz ticketBiz, CoreSmtpClient coreSmtpClient,
            ILogger logger, IGeneralDataService generalDataService) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _taxBiz = taxBiz;
            _messageBiz = messageBiz;
            _invoiceBiz = invoiceBiz;
            _smsHttpClient = smsHttpClient;
            _coreSmtpClient = coreSmtpClient;
            _ticketBiz = ticketBiz;
            _membershipServiceApi = membershipServiceApi;
            _repository = repository;
        }


        public Task<ResultList<UserSurveyModel>> List(FilterModel model)
            => ResultList<UserSurveyModel>.TryAsync(async () =>
            {
                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);
                var userSurveys = new List<UserSurvey>();

                if (isAdmin)
                    userSurveys = (await _repository.ListAsNoTrackingAsync<UserSurvey>(
                        us => model.Id == null || us.UserId == model.Id.Value && us.Invoice.IsPaid,
                        us => us.UserAnswer.Select(ua =>
                            ua.Answer.Question.Survey.Question.Select(q => q.Answer.Select(a => a.UserAnswer))),
                        us => us.UserAnswer.Select(ua =>
                            ua.Answer.Question.Survey.Question.Select(q => q.Answer.Select(a => a.MustAnswered))),
                        us => us.Survey,
                        us => us.UserAnswer.Select(ua => ua.Answer.Question.MustAnswered))).Data.ToList();
                else
                    userSurveys = (await _repository.ListAsNoTrackingAsync<UserSurvey>(
                        us => us.UserId == generalDataService.User.Id && us.Survey.Enabled.Value,
                        us => us.UserAnswer.Select(ua =>
                            ua.Answer.Question.Survey.Question.Select(q => q.Answer.Select(a => a.UserAnswer))),
                        us => us.UserAnswer.Select(ua =>
                            ua.Answer.Question.Survey.Question.Select(q => q.Answer.Select(a => a.MustAnswered))),
                        us => us.Survey,
                        us => us.UserAnswer.Select(ua => ua.Answer.Question.MustAnswered))).Data.ToList();


                var joinedSurveyIds = userSurveys?.Select(us => us.SurveyId);
                var notJoinedSurveys = await _repository.ListAsNoTrackingAsync<Survey>(
                    s =>
                        s.Enabled.Value &&
                        !joinedSurveyIds.Contains(s.Id),
                    s => s.Question.Select(
                        q => q.Answer.Select(a => a.Action)),
                    s => s.Question.Select(q => q.MustAnswered.Select(ma => ma.Answer)));

                if (!notJoinedSurveys.Success || notJoinedSurveys.Data == null)
                    return ResultList<UserSurveyModel>.Failed(Error.WithCode(ErrorCodes.NotFound));

                var userIds = userSurveys.Select(us => us.UserId).ToList();
                userIds.Add(generalDataService.User.Id);
                userIds = userIds.Distinct().ToList();
                var users = (await _membershipServiceApi.SystemUserApiService.ListByIds(userIds)).Data;

                var userSurveyModels = userSurveys?.Where(us => isAdmin || !us.IsFinsihed).Select(us =>
                    new UserSurveyModel
                    {
                        SurveyId = us.Survey.Id,
                        SurveyName = us.Survey?.Name,
                        SurveyDescription = us.Survey?.Description,
                        QuestionCount = us.Survey.Question.Count,
                        IsFinished = us.IsFinsihed,
                        IsStarted = true,
                        NextQuestion = !SurveyIsFinished(us).Data
                            ? CalculateNextQuestion(
                                us.UserAnswer.OrderBy(ua => ua.Answer.Question.Number).LastOrDefault()?.Answer, us)
                            : null,
                        User = users.FirstOrDefault(u => u.Id == us.UserId)
                    }).ToList();

                if (!isAdmin && notJoinedSurveys.Success && notJoinedSurveys.Data != null)
                    userSurveyModels.AddRange(notJoinedSurveys.Data.Select(s =>
                    {
                        var firstQuestion = s.Question.OrderBy(q => q.Number).FirstOrDefault();
                        return new UserSurveyModel
                        {
                            SurveyId = s.Id,
                            SurveyName = s.Name,
                            SurveyDescription = s.Description,
                            IsFinished = false,
                            IsStarted = false,
                            QuestionCount = s.Question.Count,
                            NextQuestion = firstQuestion != null
                                ? new QuestionCoreModel
                                {
                                    Id = firstQuestion.Id,
                                    Text = firstQuestion.Text,
                                    Number = firstQuestion.Number,
                                    MustAnsweredNumber = firstQuestion.MustAnswered.Select(ma => ma.Answer.Number)
                                        .ToList(),
                                    Answers = firstQuestion.Answer?.OrderBy(d => d.Number).Select(a =>
                                        new AnswerCoreModel
                                        {
                                            Id = a.Id,
                                            Number = a.Number,
                                            Type = (AnswerType) a.Type,
                                            Text = a.Text,
                                            Actions = a.Action.Select(aa => new ActionCoreModel
                                            {
                                                Id = aa.Id,
                                                Type = (ActionType) aa.Type,
                                                Value = aa.Value
                                            }).ToList()
                                        }).ToList()
                                }
                                : null,
                            User = users.FirstOrDefault(u => u.Id == generalDataService.User.Id)
                        };
                    }));
                return ResultList<UserSurveyModel>.Successful(userSurveyModels);
            });

        public async Task<Result> Delete(Guid userId, Guid surveyId)
        {
            var usersurvey = await _repository.FirstOrDefaultAsync<UserSurvey>(
                us => us.SurveyId == surveyId && us.UserId == userId,
                us => us.Invoice, us => us.Tax,
                us => us.Ticket.Comment, us => us.UserAnswer, us => us.UserDependentSurvey,
                us => us.UserAssessmentSurvey.Select(a => a.UserAssessmentBlob), us => us.UserRelativeSurvey);

            var appointments =
                await _repository.ListAsync<Appointment>(a => a.UserId == userId, a => a.Invoice.PaypalOrder);

            if (appointments.Success && appointments.Data.Any())
            {
                _repository.RemoveRange(appointments.Data.Select(a => a.Invoice.PaypalOrder).ToList());
                _repository.RemoveRange(appointments.Data.Select(a => a.Invoice).ToList());
                _repository.RemoveRange(appointments.Data.ToList());
            }

            if (usersurvey.Data.Tax != null)
                _repository.RemoveRange(usersurvey.Data.Tax);
            if (usersurvey.Data.Invoice != null)
                _repository.Remove(usersurvey.Data.Invoice);
            if (usersurvey.Data.Ticket != null && usersurvey.Data.Ticket.Comment.Any())
                _repository.RemoveRange(usersurvey.Data.Ticket.Comment);
            if (usersurvey.Data.UserDependentSurvey != null && usersurvey.Data.UserDependentSurvey.Any())
                _repository.RemoveRange(usersurvey.Data.UserDependentSurvey);
            if (usersurvey.Data.UserRelativeSurvey != null && usersurvey.Data.UserRelativeSurvey.Any())
                _repository.RemoveRange(usersurvey.Data.UserRelativeSurvey);
            if (usersurvey.Data.Ticket != null)
                _repository.Remove(usersurvey.Data.Ticket);
            if (usersurvey.Data.UserAssessmentSurvey != null && usersurvey.Data.UserAssessmentSurvey.Any())
                _repository.RemoveRange(usersurvey.Data.UserAssessmentSurvey);
            if (usersurvey.Data.UserAssessmentSurvey != null &&
                usersurvey.Data.UserAssessmentSurvey.Select(ua => ua.UserAssessmentBlob).Any())
                _repository.RemoveRange(usersurvey.Data.UserAssessmentSurvey.SelectMany(ua => ua.UserAssessmentBlob)
                    .ToList());
            _repository.RemoveRange(usersurvey.Data.UserAnswer);
            _repository.Remove(usersurvey.Data);
            await _repository.CommitAsync();

            return Result.Successful();
        }

        public async Task<Result> Delete(Guid userId)
        {
            var appointments =
                await _repository.ListAsync<Appointment>(a => a.UserId == userId, a => a.Invoice.PaypalOrder);

            if (appointments.Success && appointments.Data.Any())
            {
                if (appointments.Data.Select(a => a.Invoice).Any(t => t != null) &&
                    appointments.Data.Select(a => a.Invoice?.PaypalOrder).Any(a => a != null))
                    _repository.RemoveRange(appointments.Data.Select(a => a.Invoice?.PaypalOrder).Where(a => a != null)
                        .ToList());
                if (appointments.Data.Select(a => a.Invoice).Any(t => t != null))
                    _repository.RemoveRange(appointments.Data.Select(a => a.Invoice).Where(a => a != null).ToList());
                _repository.RemoveRange(appointments.Data.ToList());
            }

            var taxes =
                await _repository.ListAsync<Tax>(a => a.UserId == userId);

            if (taxes.Success && taxes.Data.Any())
            {
                _repository.RemoveRange(taxes.Data.ToList());
            }

            var invoices =
                await _repository.ListAsync<Invoice>(a => !a.Appointment.Any() && !a.UserSurvey.Any());

            if (invoices.Success && invoices.Data.Any())
            {
                _repository.RemoveRange(invoices.Data.ToList());
            }

            var messages =
                await _repository.ListAsync<Message>(a => a.FromUserId == userId || a.ToUserId == userId);

            if (messages.Success && messages.Data != null & messages.Data.Any())
            {
                _repository.RemoveRange(messages.Data.ToList());
            }

            var tickets =
                await _repository.ListAsync<Ticket>(a => a.UserId == userId, t => t.Comment);

            if (tickets.Success && tickets.Data != null && tickets.Data.Any())
            {
                if (tickets.Data != null &&
                    tickets.Data.SelectMany(t => t.Comment).Any(t => t != null))
                    _repository.RemoveRange(tickets.Data.SelectMany(t => t.Comment).ToList());
                _repository.RemoveRange(tickets.Data);
            }

            var userdependents =
                await _repository.ListAsync<UserDependentSurvey>(a => a.UserId == userId);

            if (userdependents.Success && userdependents.Data != null && userdependents.Data.Any())
            {
                _repository.RemoveRange(userdependents.Data);
            }

            var userassessments =
                await _repository.ListAsync<UserAssessmentSurvey>(a => a.UserId == userId, a => a.UserAssessmentBlob);

            if (userassessments.Success && userassessments.Data != null && userassessments.Data.Any())
            {
                _repository.RemoveRange(userassessments.Data.SelectMany(t => t.UserAssessmentBlob).ToList());
                _repository.RemoveRange(userassessments.Data);
            }

            var usersurveys = await _repository.ListAsync<UserSurvey>(
                us => us.UserId == userId,
                us => us.Invoice, us => us.Tax, us => us.UserAnswer, us => us.UserDependentSurvey,
                us => us.UserAssessmentSurvey.Select(a => a.UserAssessmentBlob), us => us.UserRelativeSurvey);


            if (usersurveys.Success && usersurveys.Data.Any())
            {
                if (usersurveys.Data.SelectMany(t => t.Tax).Any(t => t != null))
                    _repository.RemoveRange(usersurveys.Data.SelectMany(t => t.Tax).ToList());
                if (usersurveys.Data.Select(t => t.Invoice).Any(t => t != null))
                    _repository.RemoveRange(usersurveys.Data.Select(t => t.Invoice).ToList());
                if (usersurveys.Data.SelectMany(t => t.UserDependentSurvey).Any(t => t != null))
                    _repository.RemoveRange(usersurveys.Data.SelectMany(t => t.UserDependentSurvey).ToList());
                if (usersurveys.Data.SelectMany(t => t.UserRelativeSurvey).Any(t => t != null))
                    _repository.RemoveRange(usersurveys.Data.SelectMany(t => t.UserRelativeSurvey).ToList());
                if (usersurveys.Data.SelectMany(t => t.UserAssessmentSurvey).Any(t => t != null))
                    _repository.RemoveRange(usersurveys.Data.SelectMany(t => t.UserAssessmentSurvey).ToList());
                if (usersurveys.Data.SelectMany(t => t.UserAssessmentSurvey?.SelectMany(tt => tt.UserAssessmentBlob))
                    .Any(t => t != null))
                    _repository.RemoveRange(usersurveys.Data
                        .SelectMany(t => t.UserAssessmentSurvey?.SelectMany(tt => tt.UserAssessmentBlob))
                        .Where(t => t != null).ToList());
                _repository.RemoveRange(usersurveys.Data.SelectMany(t => t.UserAnswer).ToList());
                _repository.RemoveRange(usersurveys.Data);
            }


            await _repository.CommitAsync();

            return Result.Successful();
        }

        public async Task<Result<IList<ExceptionQuestionModel>>> SpecificQuestionAnswers(BaseCoreModel coreModel)
        {
            var usersurvey = await _repository.FirstOrDefaultAsNoTrackingAsync<UserSurvey>(u =>
                    u.SurveyId == coreModel.Id && u.UserId == generalDataService.User.Id,
                u => u.Survey.Question.Select(q => q.Answer.Select(a => a.Action)),
                u => u.UserAnswer.Select(ua => ua.Answer.Question.Answer),
                u => u.UserAnswer.Select(ua => ua.Answer.Question.Survey));
            var answers = usersurvey.Data.UserAnswer
                .Where(ua => ua.Answer.Question.Number >= 16 && ua.Answer.Question.Number <= 22).ToList();
            var questions = usersurvey.Data.Survey.Question.Where(q => q.Number >= 16 && q.Number <= 22).ToList();
            return Result<IList<ExceptionQuestionModel>>.Successful(questions.Select(q =>
            {
                var answer = answers.FirstOrDefault(a => a.Answer.Question.Number == q.Number);
                return new ExceptionQuestionModel
                {
                    Question = new QuestionCoreModel
                    {
                        Id = q.Id,
                        Text = q.Text,
                        Number = q.Number,
                        Answers = q.Answer.Select(a => new AnswerCoreModel
                        {
                            Id = a.Id,
                            Text = a.Text,
                            Number = a.Number,
                            Type = (AnswerType) a.Type
                        }).ToList()
                    },
                    UserAnswerId = answer != null ? (Guid?) answer.Answer.Id : null
                };
            }).OrderBy(q => q.Question.Number).ToList());
        }


        public async Task<Result<UserAnswerModel>> SpecificAnswers(ExceptionAnswerModel model)
        {
            var answer = await _repository.FirstOrDefaultAsNoTrackingAsync<Answer>(a => a.Id == model.Answers.FirstOrDefault(),a=>a.Question.Survey);
            
            var usersurvey = await _repository.FirstOrDefaultAsync<UserSurvey>(u =>
                    u.SurveyId == answer.Data.Question.Survey.Id && u.UserId == generalDataService.User.Id,
                u => u.Survey.Question.Select(q => q.Answer.Select(a => a.Action)),
                u => u.UserAnswer.Select(ua => ua.Answer.Question.Answer),
                u => u.UserAnswer.Select(ua => ua.Answer.Question.Survey));

            var answers = usersurvey.Data.UserAnswer
                .Where(ua => ua.Answer.Question.Number >= 16 && ua.Answer.Question.Number <= 22).ToList();

            _repository.RemoveRange(answers);

            var questions = usersurvey.Data.Survey.Question.Where(q => q.Number >= 16 && q.Number <= 22).ToList();
            var userAnswers = questions.Select(q => new UserAnswer
            {
                Id = Guid.NewGuid(),
                Answer = q.Answer.FirstOrDefault(a => model.Answers.Contains(a.Id)),
                UserSurveyId = usersurvey.Data.Id
            }).ToList();
            userAnswers.ForEach(ua => usersurvey.Data.UserAnswer.Add(ua));
            await _repository.CommitAsync();

            return Result<UserAnswerModel>.Successful(new UserAnswerModel
            {
                Question = CalculateNextQuestion(
                    usersurvey.Data.UserAnswer.OrderBy(ua => ua.Answer.Question.Number).Reverse().FirstOrDefault()
                        ?.Answer,
                    usersurvey.Data),
            });
        }

        public async Task<Result<UserSurvey>> GetByUserIdAndSurveyId(Guid userId, Guid surveyId)
        {
            var survey = (await _repository.FirstOrDefaultAsNoTrackingAsync<UserSurvey>(
                us => us.SurveyId == surveyId && us.UserId == userId,
                us => us.UserDependentSurvey,
                us => us.Invoice,
                us => us.Tax,
                us => us.UserAssessmentSurvey.Select(ua => ua.UserAssessmentBlob.Select(u => u.Blob)),
                us => us.UserRelativeSurvey,
                us => us.UserAnswer.Select(ua =>
                    ua.Answer.Question.Survey.Question.Select(q => q.Answer.Select(a => a.UserAnswer))),
                us => us.UserAnswer.Select(ua =>
                    ua.Answer.Question.Survey.Question.Select(q => q.Answer.Select(a => a.MustAnswered))),
                us => us.Survey,
                us => us.UserAnswer.Select(ua => ua.Answer.Action),
                us => us.UserAnswer.Select(ua => ua.Answer.Question.MustAnswered))).Data;

            if (survey == null)
                Result<UserSurvey>.Failed(Error.WithData(1000, new[] {"no survey found"}));
            return Result<UserSurvey>.Successful(survey);
        }

        private QuestionCoreModel CalculateNextQuestion(Answer lastAnswer, UserSurvey userSurvey, bool isNext = false)
        {
            var questionNumber = lastAnswer.Question.Number;
            var nextQuestion =
                lastAnswer.Question.Survey.Question.FirstOrDefault(q => q.Number == questionNumber + 1);
            if (nextQuestion == null)
                return null;

            var answerIds = userSurvey.UserAnswer.Select(ua => ua.Answer.Id).ToList();

            if (isNext)
            {
                var Questions = userSurvey.Survey.Question.Where(q => q.Number > questionNumber)
                    .OrderBy(q => q.Number).ToList();
                nextQuestion = Questions.FirstOrDefault(q =>
                    !q.MustAnswered.Any() || q.MustAnswered.All(a => answerIds.Contains(a.Answer.Id)));

                return new QuestionCoreModel
                {
                    Id = nextQuestion.Id, Text = nextQuestion.Text, Number = nextQuestion.Number,
                    Answers = nextQuestion.Answer.OrderBy(a => a.Number).Select(answer => new AnswerCoreModel
                    {
                        Id = answer.Id, Text = answer.Text, Type = (AnswerType) answer.Type,
                        Actions = answer.Action?.Select(a => new ActionCoreModel
                        {
                            Id = a.Id, Type = (ActionType) a.Type, Value = a.Value
                        }).ToList()
                    }).ToList()
                };
            }

            var notAnsweredQuestions = userSurvey.Survey.Question
                .Where(q => !q.Answer.Any(a => answerIds.Contains(a.Id))).Where(q => q.Number > questionNumber)
                .OrderBy(q => q.Number).ToList();
            nextQuestion = notAnsweredQuestions.FirstOrDefault(q =>
                !q.MustAnswered.Any() || q.MustAnswered.All(a => answerIds.Contains(a.Answer.Id)));

            return new QuestionCoreModel
            {
                Id = nextQuestion.Id, Text = nextQuestion.Text, Number = nextQuestion.Number,
                Answers = nextQuestion.Answer.OrderBy(a => a.Number).Select(answer => new AnswerCoreModel
                {
                    Id = answer.Id, Text = answer.Text, Type = (AnswerType) answer.Type,
                    Actions = answer.Action?.Select(a => new ActionCoreModel
                    {
                        Id = a.Id, Type = (ActionType) a.Type, Value = a.Value
                    }).ToList()
                }).ToList()
            };
        }

        private QuestionCoreModel CalculatePreviousQuestion(Question lastAnswer, UserSurvey userSurvey)
        {
            var questions = userSurvey.UserAnswer.Select(ua => ua.Answer.Question).OrderBy(q => q.Number).ToList();

            var lastQuestion = questions.FirstOrDefault(q => q.Number == lastAnswer.Number);
            var index = questions.IndexOf(lastQuestion) - 1;
            Question previousQuestion = null;
            if (!questions.Any(q => q.Id == lastAnswer.Id))
                previousQuestion = questions.LastOrDefault();
            else if (questions.Count != 1)
                previousQuestion = questions.ToList()[index];
            else
                previousQuestion = questions.FirstOrDefault();

            return new QuestionCoreModel
            {
                Id = previousQuestion.Id, Text = previousQuestion.Text, Number = previousQuestion.Number,
                MustAnsweredNumber = previousQuestion.MustAnswered.Select(ma => ma.Answer.Number).ToList(),
                Answers = previousQuestion.Answer.OrderBy(a => a.Number).Select(answer => new AnswerCoreModel
                    {
                        Id = answer.Id, Text = answer.Text, Type = (AnswerType) answer.Type, Number = answer.Number,
                        Actions = answer.Action.Select(a => new ActionCoreModel
                        {
                            Id = a.Id, Type = (ActionType) a.Type, Value = a.Value
                        }).ToList()
                    })
                    .ToList()
            };
        }

        public Task<Result<UserSurveyModel>> Answer(SurveyAnswerModel model)
            => Result<UserSurveyModel>.TryAsync(async () =>
            {
                var results = await _repository.ListAsync<Answer>(a => model.AnswerIds.Contains(a.Id),
                    a => a.Question.Survey.Question.Select(q => q.Answer.Select(aa => aa.Action)),
                    a => a.Question.MustAnswered, a => a.Question.Survey.Question.Select(q => q.MustAnswered),
                    a => a.Question.Survey.Question.Select(q => q.MustAnswered)
                    , a => a.Action);


                if (!results.Success || results.Data == null || !results.Data.Any() ||
                    results.Data.Count != model.AnswerIds.Count)
                    return Result<UserSurveyModel>.Failed(Error.WithData(1000, new[] {"answer not found"}));
                if (results.Data.GroupBy(a => a.Question).ToList().Count() != 1)
                    return Result<UserSurveyModel>.Failed(Error.WithData(1000,
                        new[] {"answers are not from one question"}));


                var answers = results.Data;

                var resultUserSurvey = await _repository.FirstOrDefaultAsync<UserSurvey>(us =>
                        us.SurveyId == answers.FirstOrDefault().Question.Survey.Id &&
                        us.UserId == generalDataService.User.Id,
                    us => us.UserAnswer.Select(ua => ua.Answer.Question.Survey.Question.Select(q => q.Answer)),
                    us => us.Survey.Question.Select(q => q.MustAnswered),
                    us => us.Survey.Question.Select(question => question.Answer), us => us.UserDependentSurvey);

//                var resultUserSurvey = await _repository.FirstOrDefaultAsync<UserSurvey>(us =>
//                        us.SurveyId == answers.FirstOrDefault().Question.Survey.Id && us.UserId == generalDataService.User.Id,
//                    us => us.UserAnswer);

                UserSurvey userSurvey = null;
                if (resultUserSurvey.Data == null) // first answer
                {
                    userSurvey = new UserSurvey
                    {
                        Id = Guid.NewGuid(),
                        UserId = generalDataService.User.Id,
                        Survey = answers.FirstOrDefault().Question.Survey,
                        IsFinsihed = answers.FirstOrDefault().Question.Survey.Question.Count == 1,
                        UserAnswer = answers.Select(answer => new UserAnswer
                            {Id = Guid.NewGuid(), Answer = answer, Text = model.UserAnswer}).ToList()
                    };
                    _repository.Add(userSurvey);
                }
                else // not the first answer
                {
                    userSurvey = resultUserSurvey.Data;

                    var questionsAnswered = userSurvey.UserAnswer.Select(ua => ua.Answer.Question).ToList();
                    if (questionsAnswered.Select(qa => qa.Id).Contains(answers.FirstOrDefault().Question.Id)
                    ) // change answer
                    {
                        var previousAnswers = userSurvey.UserAnswer.Where(ua =>
                            answers.Any(aa => aa.Question.Id == ua.Answer.Question.Id)).ToList();
                        previousAnswers.AddRange(userSurvey.UserAnswer.Where(ua =>
                            ua.Answer.Question.Number > answers.FirstOrDefault().Question.Number));
                        var actions = previousAnswers.Where(ua =>
                                ua.Answer.Question.Number > answers.FirstOrDefault().Question.Number).ToList()
                            .SelectMany(ua => ua.Answer.Action);
                        if (actions.Any(a => a.Type == (int) ActionType.AddDependent))
                            if (previousAnswers.Any(ua => ua.Answer.Question.Text.ToLower().Contains("spouse")))
                            {
                                _repository.RemoveRange(userSurvey.UserDependentSurvey);
                                if (userSurvey.UserAssessmentSurvey != null && userSurvey.UserAssessmentSurvey.Any() &&
                                    userSurvey.UserAssessmentSurvey
                                        .Select(ua => ua.UserAssessmentBlob).Any())
                                    _repository.RemoveRange(userSurvey.UserAssessmentSurvey
                                        .Select(ua => ua.UserAssessmentBlob).ToList());
                                if (userSurvey.UserAssessmentSurvey != null && userSurvey.UserAssessmentSurvey.Any())
                                    _repository.RemoveRange(userSurvey.UserAssessmentSurvey);
                            }
                            else
                            {
                                var allDependents =
                                    await _membershipServiceApi.MembershipLinkedUserApiService.ListByUser(
                                        new MembershipService.ApiClient.Models.BaseModel
                                        {
                                            Id = generalDataService.User.Id
                                        });
                                var dependentIds = allDependents.Data.Where(ad => ad.RelationType.ToLower() != "spouse")
                                    .ToList()
                                    .Select(ad => ad.FirstUser.Id).ToList();
                                _repository.RemoveRange(
                                    userSurvey.UserDependentSurvey.Where(ud => dependentIds.Contains(ud.UserId))
                                        .ToList());
                            }

                        if (actions.Any(a => a.Type == (int) ActionType.AddRelative))
                            _repository.RemoveRange(userSurvey.UserRelativeSurvey);


                        previousAnswers.ForEach(previousAnswer => userSurvey.UserAnswer.Remove(previousAnswer));
                        _repository.RemoveRange(previousAnswers);
                    }

                    answers.ToList().ForEach(
                        answer => userSurvey.UserAnswer.Add(new UserAnswer
                            {Id = Guid.NewGuid(), Answer = answer, Text = model.UserAnswer}));
                }

                QuestionCoreModel nextQuestionCoreModel = CalculateNextQuestion(answers.FirstOrDefault(), userSurvey);

                var userResult = await _membershipServiceApi.AuthAuthApiService.Setting(
                    new MembershipService.ApiClient.Models.BaseModel
                        {Id = generalDataService.User.Id});

                var profile = await _membershipServiceApi.AuthAuthApiService.Profile(
                    new MembershipService.ApiClient.Models.BaseModel
                        {Id = generalDataService.User.Id});

                var isFinished = SurveyIsFinished(userSurvey).Data;

                var makeAppointment = false;
                var userCartUpdated = false;
                Guid? invoiceId = null;
                if (isFinished) // Perform actions after survey is finished
                {
                    var result = (await PerformActions(userSurvey)).Data;
                    invoiceId = result.Item1;
                    makeAppointment = result.Item2;

                    await _messageBiz.Add(new CreateMessageModel
                    {
                        Title = "Survey Finished",
                        Body =
                            "you have successfully finished your survey , we will check and contact you about the results as soon as possible ",
                        Priority = MessagePriority.High
                    });

                    _coreSmtpClient.SendSurveySubmittedNotif(profile.Data.Email, profile.Data.Mobile,
                        profile.Data.Username,
                        DateTime.Now.ToString("F"));


//                    _coreSmtpClient.Send(userResult.Data.Email,
//                        $"Dear {userResult.Data.Firstname} {userResult.Data.Lastname} ,\n you have finished our survey , we will check and contact you about the results as soon as possible. \n Best Regards",
//                        "Finished Survey ");

//                    _smsHttpClient.Send(userResult.Data.Mobile,
//                        $"Dear {userResult.Data.Firstname} {userResult.Data.Lastname} , You have finished doing a survey, we will check and contact you about the results as soon as possible. \n Best Regards ");
                }

                userSurvey.IsFinsihed = isFinished;
                await _repository.CommitAsync();

                return Result<UserSurveyModel>.Successful(new UserSurveyModel
                {
                    NextQuestion = nextQuestionCoreModel,
                    SurveyId = answers.FirstOrDefault().Question.Survey.Id,
                    MakeAnAppointment = makeAppointment,
                    UserCartUpdated = userCartUpdated,
                    SurveyName = answers.FirstOrDefault().Question.Survey.Name,
                    IsFinished = isFinished,
                    IsStarted = true,
                    QuestionCount = userSurvey.Survey.Question.Count,
                    InvoiceId = invoiceId,
                    User = userResult.Data
                });
            });

        public Task<Result<UserAnswerModel>> NextQuestion(BaseCoreModel coreModel) // question Id
            => Result<UserAnswerModel>.TryAsync(async () =>
            {
                var result = await _repository.FirstOrDefaultAsync<Answer>(a => a.Question.Id == coreModel.Id,
                    us => us.UserAnswer.Select(ua => ua.Answer.Question.MustAnswered),
                    a => a.Question.Survey.Question.Select(q => q.Answer.Select(aa => aa.Action)), a => a.Action);
                if (!result.Success || result.Data == null)
                    return Result<UserAnswerModel>.Failed(Error.WithCode(ErrorCodes.NotFound));
                var answer = result.Data;

                var resultUserSurvey = await _repository.FirstOrDefaultAsync<UserSurvey>(us =>
                        us.SurveyId == answer.Question.Survey.Id && us.UserId == generalDataService.User.Id,
                    us => us.UserAnswer.Select(ua =>
                        ua.Answer.Question.Survey.Question.Select(q => q.Answer.Select(a => a.UserAnswer))),
                    us => us.UserAnswer.Select(ua =>
                        ua.Answer.Question.Survey.Question.Select(q => q.Answer.Select(a => a.MustAnswered))),
                    us => us.Survey,
                    us => us.UserAnswer.Select(ua => ua.Answer.Question.MustAnswered));

                var userSurvey = resultUserSurvey.Data;
                if (!userSurvey.UserAnswer.Any())
                    return Result<UserAnswerModel>.Failed(Error.WithData(1000,
                        new[] {"you have to answer the current question to see the next question"}));

                var nextQuestion = CalculateNextQuestion(userSurvey.UserAnswer.Select(ua => ua.Answer)
                    .FirstOrDefault(a => a.Question.Id == coreModel.Id), userSurvey, true);

                var answers = userSurvey.UserAnswer.Where(ua => ua.Answer.Question.Number == nextQuestion.Number)
                    .ToList();

                if (!answers.Any() && nextQuestion.Number - 1 !=
                    userSurvey.UserAnswer.Select(ua => ua.Answer.Question).Max(q => q.Number))
                    return Result<UserAnswerModel>.Failed(Error.WithData(1000,
                        new[] {"this is the last question user has answered "}));


                return Result<UserAnswerModel>.Successful(new UserAnswerModel
                {
                    Question = nextQuestion,
                    QuestionCount = userSurvey.Survey.Question.Count,
                    UserAnswerId = answers.Any() ? answers?.Select(a => a.Answer.Id)?.ToList() : new List<Guid>(),
                    AnswerType =
                        answers.Any() ? (AnswerType) answers.FirstOrDefault()?.Answer?.Type : AnswerType.Static,
                    AnswerText = answers.Any() ? answers.FirstOrDefault()?.Answer?.Text : "",
                    UserAnswerText = answers.Any() ? answers.FirstOrDefault()?.Text : ""
                });
            });

        public Task<Result<UserAnswerModel>> PreviousQuestion(BaseCoreModel coreModel) // question Id
            => Result<UserAnswerModel>.TryAsync(async () =>
            {
                var result = await _repository.FirstOrDefaultAsync<Answer>(a => a.Question.Id == coreModel.Id,
                    us => us.UserAnswer.Select(ua => ua.Answer.Question.MustAnswered),
                    a => a.Question.Survey.Question.Select(q => q.Answer.Select(aa => aa.Action)), a => a.Action);
                if (!result.Success || result.Data == null)
                    return Result<UserAnswerModel>.Failed(Error.WithCode(ErrorCodes.NotFound));
                var answer = result.Data;
                if (answer.Question.Number == 1)
                    return Result<UserAnswerModel>.Failed(Error.WithData(1000, new[] {"this is the first question "}));

                var resultUserSurvey = await _repository.FirstOrDefaultAsync<UserSurvey>(us =>
                        us.SurveyId == answer.Question.Survey.Id && us.UserId == generalDataService.User.Id,
                    us => us.UserAnswer.Select(ua =>
                        ua.Answer.Question.Survey.Question.Select(q => q.Answer.Select(a => a.UserAnswer))),
                    us => us.UserAnswer.Select(ua =>
                        ua.Answer.Question.Survey.Question.Select(q => q.Answer.Select(a => a.MustAnswered))),
                    us => us.Survey,
                    us => us.UserAnswer.Select(ua => ua.Answer.Question.MustAnswered));


                if (resultUserSurvey.Data == null) // first answer
                {
                    return Result<UserAnswerModel>.Successful(null);
                }
                else // not the first answer
                {
                    var userSurvey = resultUserSurvey.Data;
                    var previousQuestion = CalculatePreviousQuestion(answer.Question, userSurvey);
                    var answers = userSurvey.UserAnswer
                        .Where(ua => ua.Answer.Question.Number == previousQuestion.Number)
                        .ToList();
                    return Result<UserAnswerModel>.Successful(new UserAnswerModel
                    {
                        Question = previousQuestion,
                        QuestionCount = userSurvey.Survey.Question.Count,
                        UserAnswerId = answers.Select(a => a.Answer.Id).ToList(),
                        AnswerType = (AnswerType) answers.FirstOrDefault()?.Answer?.Type,
                        AnswerText = answers.FirstOrDefault()?.Answer.Text,
                        UserAnswerText = answers.FirstOrDefault()?.Text
                    });
                }
            });

        public Task<Result<bool>> UserDoneSurvey(Guid userId)
            => Result<bool>.TryAsync(async () =>
            {
                var usersurvey =
                    await _repository.FirstOrDefaultAsNoTrackingAsync<UserSurvey>(us => us.UserId == userId);
                if (usersurvey.Success && usersurvey.Data != null)
                    return Result<bool>.Successful(true);
                return Result<bool>.Successful(false);
            });

        public Task<Result> AddDependent(Guid userId, Guid usersurveyId)
            => Result.TryAsync(async () =>
            {
                var userDependentSurvey = new UserDependentSurvey
                {
                    Id = Guid.NewGuid(),
                    UserSurveyId = usersurveyId,
                    UserId = userId
                };
                _repository.Add(userDependentSurvey);
                await _repository.CommitAsync();
                return Result.Successful();
            });


        private Result<bool> SurveyIsFinished(UserSurvey userSurvey)
            => Result<bool>.Try(() =>
            {
                var totalAnswers = userSurvey.UserAnswer.Max(ua => ua.Answer.Question.Number);
                var totalQuestions = userSurvey.Survey.Question.Max(q => q.Number);
                return Result<bool>.Successful(totalAnswers == totalQuestions);
            });

        private async Task<Result<(Guid, bool)>> PerformActions(UserSurvey userSurvey)
        {
            var actionGroups = userSurvey.UserAnswer.SelectMany(ua => ua.Answer.Action).GroupBy(a => a.Type);

            bool makeAppointment = false;
            var invoiceId = Guid.Empty;
            for (int i = 0; i < actionGroups.OrderBy(a => a.Key).Reverse().Count(); i++)
            {
                var action = actionGroups.ToList()[i];
                var type = (ActionType) action.Key;
                switch (type)
                {
                    case ActionType.CreateAppointment:
                        makeAppointment = true;
                        break;
                    case ActionType.AddDependent:
                        break;
                    case ActionType.SendTicketAndCreateAppointment:
                        await _ticketBiz.Add(new CreateTicketModel
                        {
                            Priority = TicketPriority.Medium,
                            Text =
                                "Survey Was Too Complex For Online Process , Please Review Booked Consultation For This User.",
                            Title = "Survey", UserId = generalDataService.User.Id
                        }, userSurvey, false);
                        makeAppointment = true;
                        break;
                }
            }

            var amount = 95 +
                         (userSurvey.UserDependentSurvey.Count * 95);
            decimal tax = (decimal)amount * 5 / 100;

            var hasSpouse = actionGroups.Any(a => a.Key == (int) ActionType.AddSpouse);
            var spouseText = "";
            if (hasSpouse)
                spouseText = "Spousal Income Tax : 1 x $95 \n";
            var dependentCount = userSurvey.UserDependentSurvey.Count;
            if (hasSpouse)
                dependentCount--;
            var dependentText = "";
            if (dependentCount > 0)
                dependentText = $"+19 Dependent Income Tax : {dependentCount} x $95 \n";
            var mainuserText = "";
            if (dependentCount > 0)
                mainuserText = $"Main User Income Tax Return : 1 x $95 \n";
            invoiceId = (await _invoiceBiz.Add(new CreateInvoiceModel
                {
                    Amount = amount,
                    Description =
                        $"{mainuserText} {spouseText} {dependentText} SubTotal = ${amount} \n Taxes(GST)= ${(decimal)tax} \n Total = ${(decimal)(amount + tax)}",

                    Title = "Personal Tax Return",
                    UserSurveyId = userSurvey.Id,
                    Enabled = true,
                    Status = InvoiceStatus.Pending, UserId = generalDataService.User.Id
                },
                userSurvey)).Data;


            await _taxBiz.AddForSurvey(new CreateTaxModel
            {
                UserId = generalDataService.User.Id, Title = userSurvey.Survey.Name,
                Description = userSurvey.Survey.Description, Enabled = true,
                Status = makeAppointment ? TaxStatus.SetConsultation : TaxStatus.PaymentPending
            }, userSurvey);

            return Result<(Guid, bool)>.Successful((invoiceId, makeAppointment));
        }
    }
}