using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Models;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Business.Services.Email;
using ERP.CoreService.Business.Services.Sms;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Tax;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Enums;
using ERP.MembershipService.ApiClient.Models;
using FilterModel = ERP.CoreService.Core.Models.FilterModel;
using TaxStatus = ERP.CoreService.Core.Base.TaxStatus;

namespace ERP.CoreService.Business.Classes
{
    public class TaxBiz : Base, ITaxBiz
    {
        private readonly IRepository _repository;
        private readonly IMembershipServiceApi _membershipServiceApi;
        private readonly CoreSmtpClient _coreSmtpClient;
        private readonly SmsHttpClient _smsHttpClient;

        public TaxBiz(IMapperService mapper, IRepository repository, IMapper autoMapper,
            IMembershipServiceApi membershipServiceApi, CoreSmtpClient coreSmtpClient, SmsHttpClient smsHttpClient,
            ILogger logger, IGeneralDataService generalDataService) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _smsHttpClient = smsHttpClient;
            _coreSmtpClient = coreSmtpClient;
            _membershipServiceApi = membershipServiceApi;
            _repository = repository;
        }

        public Task<Result<Guid>> Add(CreateTaxModel model, UserSurvey userSurvey = null)
            => Result<Guid>.TryAsync(async () =>
            {
//                var user = (await _membershipServiceApi.SystemUserApiService.Get(
//                    new MembershipService.ApiClient.Models.BaseModel {Id = model.UserId})).Data;

                var tax = new Tax
                {
                    Id = Guid.NewGuid(),
                    Description = model.Description,
                    CreationDate = DateTime.Now,
                    UserId = model.UserId,
                    TaxFile = null,
                    Amount = model.Amount,
                    Status = model.Status != null ? (byte) model.Status : (byte) TaxStatus.SetConsultation,
                    Title = model.Title,
                    Enabled = model.Enabled
                };

                if (userSurvey != null)
                    tax.UserSurvey = (userSurvey);

                _repository.Add(tax);
                await _repository.CommitAsync();

//                _coreSmtpClient.Send(user.Email,
//                    $"Dear  {user.Firstname}  {user.Lastname} ,\n Your Tax Report is Assigned to you in the system , please check it as soon as possible . \n Best Regards",
//                    "Your Tax Report");

//                await _smsHttpClient.Send(user.Mobile,
//                    $"Dear  {user.Firstname} {user.Lastname} ,\n Your Tax Report is Assigned to you in the system , please check it as soon as possible . \n Best Regards");

                return Result<Guid>.Successful(tax.Id);
            });

        public Task<Result<long>> CountByUser(Guid userId)
            => Result<long>.TryAsync(async () =>
            {
                var taxes = await _repository.ListAsNoTrackingAsync<Tax>(
                    x => (!x.IsChecked) && x.UserId == userId,
                    new PagingModel {PageNumber = 0, PageSize = 1});
                if (!taxes.Success || taxes.Items == null)
                    return Result<long>.Successful(0);
                return Result<long>.Successful(taxes.TotalCount);
            });

        public Task<Result> AddForSurvey(CreateTaxModel model, UserSurvey userSurvey)
            => Result.TryAsync(async () =>
            {
                var userIds = new List<Guid>() {model.UserId};
                if (userSurvey.UserDependentSurvey.Any())
                {
                    userIds.AddRange(userSurvey.UserDependentSurvey.Select(u => u.UserId));
                }

                for (int i = 0; i < userIds.Count; i++)
                {
                    var tax = new Tax
                    {
                        Id = Guid.NewGuid(),
                        Description = model.Description,
                        CreationDate = DateTime.Now,
                        UserId = userIds[i],
                        TaxFile = null,
                        Amount = model.Amount,
                        Status = (byte) model.Status,
                        Title = model.Title,
                        Enabled = model.Enabled,
                        UserSurvey = userSurvey
                    };

                    _repository.Add(tax);
                }

                await _repository.CommitAsync();
                return Result.Successful();
            });

        public Task<Result<TaxCoreModel>> Get(BaseCoreModel coreModel)
            => Result<TaxCoreModel>.TryAsync(async () =>
            {
                var result = await _repository.FirstOrDefaultAsync<Tax>(s => s.Id == coreModel.Id);

                if (!result.Success || result.Data == null)
                    return Result<TaxCoreModel>.Failed(Error.WithData(1000, new[] {"Tax Not Found"}));

                var tax = result.Data;

                tax.IsChecked = true;
                await _repository.CommitAsync();

                var userIds = tax.UserId;
                var user = (await _membershipServiceApi.AuthAuthApiService.Setting(
                    new MembershipService.ApiClient.Models.BaseModel {Id = userIds})).Data;
                if (user == null)
                    return Result<TaxCoreModel>.Failed(Error.WithData(1000, new[] {"User not found "}));

                var taxModel = new TaxCoreModel
                {
                    Id = tax.Id,
                    Title = tax.Title,
                    Description = tax.Description,
                    User = user,
                    TaxFile = tax.TaxFile != null
                        ? new TaxFileModel
                        {
                            EngagementBlobId = tax.TaxFile.EngagementBlobId,
                            TaxFormBlobId = tax.TaxFile.TaxFormBlobId,
                            ExtraTaxFile = tax.TaxFile.ExtraTaxFile != null && tax.TaxFile.ExtraTaxFile.Any()
                                ? tax.TaxFile.ExtraTaxFile.Select(e => new ExtraTaxFileModel
                                {
                                    Name = e.Name,
                                    BlobId = e.BlobId
                                }).ToList()
                                : null
                        }
                        : null,
                    Amount = tax.Amount,
                    Status = (TaxStatus) tax.Status,
                    CreationDate = tax.CreationDate,
                    Enabled = tax.Enabled
                };
                return Result<TaxCoreModel>.Successful(taxModel);
            });

        public Task<ResultList<SurveyTaxModel>> List(FilterModel model)
            => ResultList<SurveyTaxModel>.TryAsync(async () =>
            {
                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);
                var taxes = new ResultList<Tax>();
                if (isAdmin)
                    taxes = await _repository.ListAsync<Tax>(i =>
                            (string.IsNullOrEmpty(model.Keyword) || model.Keyword == i.Title) &&
                            (model.UserId == null || model.UserId.Value == i.UserId),
                        new PagingModel {PageNumber = 0, PageSize = 1000000}, t => t.UserSurvey.Survey,
                        t => t.UserSurvey.Tax.Select(tt => tt.TaxFile.ExtraTaxFile),
                        t => t.TaxFile.ExtraTaxFile
                    );
                else
                    taxes = (await _repository.ListAsync<Tax>(i =>
                            i.UserId == generalDataService.User.Id &&
                            (string.IsNullOrEmpty(model.Keyword) || model.Keyword == i.Title),
                        new PagingModel {PageNumber = 0, PageSize = 1000000}, t => t.UserSurvey.Survey,
                        t => t.UserSurvey.Tax.Select(tt => tt.TaxFile.ExtraTaxFile),
                        t => t.TaxFile.ExtraTaxFile
                    ));


                if (taxes == null)
                    return ResultList<SurveyTaxModel>.Failed(Error.WithData(1000, new[] {"Taxes Not Found"}));

                var userIds = taxes.Items.SelectMany(i => i.UserSurvey.Tax).Select(t => t.UserId).ToList();
                var users = (await _membershipServiceApi.SystemUserApiService.ListByIds(userIds)).Data;
                if (users == null)
                    return ResultList<SurveyTaxModel>.Failed(Error.WithData(1000, new[] {"Users not found "}));

                taxes.Items.ToList().ForEach(tax =>
                {
                    if (tax.UserId == generalDataService.User.Id)
                        tax.IsChecked = true;
                });
                await _repository.CommitAsync();

                var allLinkedUsers =
                    await _membershipServiceApi.SystemLinkedUserApiService.ListAll();

                users.ToList().ForEach(u => u.Role.Feature = null);
                var surveyTaxModels = taxes.Items.Select(t => t.UserSurvey).Distinct().Select(tt =>
                    new SurveyTaxModel
                    {
                        SurveyName = tt.Survey.Name,
                        SurveyId = tt.Survey.Id,
                        Status = (TaxStatus) tt.Tax
                            .Where(t => t.UserSurvey != null && t.UserSurvey.Id == tt.Id).FirstOrDefault().Status,
                        MainUser = users.FirstOrDefault(u => u.Id == tt.UserId),
                        Taxes = tt.Tax
                            .Where(t => t.UserSurvey != null && t.UserSurvey.Id == tt.Id).Select(tax =>
                                new TaxCoreModel
                                {
                                    Id = tax.Id,
                                    Title = tax.Title,
                                    Description = tax.Description,
                                    User = users.FirstOrDefault(u => u.Id == tax.UserId),
                                    RelationType = allLinkedUsers.Data.FirstOrDefault(a =>
                                                       a.FirstUser.Id == tax.UserId && a.SecondUser.Id ==
                                                       users.FirstOrDefault(u => u.Id == tt.UserId).Id) != null
                                        ? allLinkedUsers.Data.FirstOrDefault(a =>
                                            a.FirstUser.Id == tax.UserId && a.SecondUser.Id ==
                                            users.FirstOrDefault(u => u.Id == tt.UserId).Id).RelationType
                                        : "",
                                    TaxFile = tax.TaxFile != null
                                        ? new TaxFileModel
                                        {
                                            EngagementBlobId = tax.TaxFile.EngagementBlobId,
                                            TaxFormBlobId = tax.TaxFile.TaxFormBlobId,
                                            UserSignedEngagementId = tax.TaxFile.UserSignedEngagementId,
                                            UserSignedTaxFormId = tax.TaxFile.UserSignedTaxFormId,
                                            ExtraTaxFile =
                                                tax.TaxFile.ExtraTaxFile != null && tax.TaxFile.ExtraTaxFile.Any()
                                                    ? tax.TaxFile.ExtraTaxFile.Select(e => new ExtraTaxFileModel
                                                    {
                                                        Name = e.Name,
                                                        BlobId = e.BlobId,
                                                        BlobName = e.Name,
                                                        SetByAdmin = e.SetByAdmin != null ? e.SetByAdmin.Value : true,
                                                        Efile = e.Efile != null ? e.Efile.Value : false
                                                    }).ToList()
                                                    : null
                                        }
                                        : null,
                                    Amount = tax.Amount,
                                    CreationDate = tax.CreationDate,
                                    Status = (TaxStatus) tax.Status,
                                    Enabled = tax.Enabled
                                }).ToList()
                    }).ToList();

                var results = surveyTaxModels.OrderBy(t => t.Taxes.FirstOrDefault().CreationDate).Reverse()
                    .Skip(model.PageNumber * model.PageSize).Take(model.PageSize).ToList();
//                var blobIds = results.SelectMany(a => a.Taxes.Select(t => t.TaxFile?.ExtraTaxFile)).Where(a=>a!=null).SelectMany(a=>a).Select(e=>e.BlobId).ToList();
//                var blobs = await _repository.ListAsNoTrackingAsync<Blob>(b => blobIds.Contains(b.Id));
//                results.ForEach(r=>r.Taxes.ForEach(t=>t.TaxFile.ExtraTaxFile.ForEach(e =>
//                {
//                    var blob = blobs.Data.FirstOrDefault(v => v.Id == e.BlobId);
//                    if (blob != null)
//                        e.BlobName = blob.Title;
//                })));
                return ResultList<SurveyTaxModel>.Successful(
                    results,
                    taxes.TotalCount, model.PageNumber,
                    model.PageSize);
            });

        public Task<Result<TaxCoreModel>> Edit(UpdateTaxModel model)
            => Result<TaxCoreModel>.TryAsync(async () =>
            {
                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);


                var tax = (await _repository.FirstOrDefaultAsync<Tax>(i => i.Id == model.Id,
                    t => t.TaxFile.ExtraTaxFile)).Data;

                if (tax == null)
                    return Result<TaxCoreModel>.Failed(Error.WithData(1000, new[] {"Tax Not Found"}));


                var profile =
                    await _membershipServiceApi.AuthAuthApiService.Profile(new BaseModel {Id = tax.UserId});

                if (model.Status != (TaxStatus) tax.Status && model.Status == TaxStatus.DocumentSign)
                {
                    _coreSmtpClient.SendTaxesReady(profile.Data.Email, profile.Data.Firstname+" "+profile.Data.Lastname);
                }

                if (model.Status != (TaxStatus) tax.Status && model.Status == TaxStatus.AccnetEFiling)
                {
                    _coreSmtpClient.SendEFileTaxes(profile.Data.Email, profile.Data.Firstname+" "+profile.Data.Lastname);
                    _coreSmtpClient.SendAccnetEfile(profile.Data.Email, profile.Data.Firstname+" "+profile.Data.Lastname);
                }

                if (model.Status != (TaxStatus) tax.Status && model.Status == TaxStatus.UserEFiling)
                {
                    _coreSmtpClient.SendTaxesFilling(profile.Data.Email, profile.Data.Firstname+" "+profile.Data.Lastname);
                    _coreSmtpClient.SendUserEfile(profile.Data.Email, profile.Data.Firstname+" "+profile.Data.Lastname);
                }

                if (model.TaxFile != null)
                {
                    if (tax.TaxFile == null)
                        tax.TaxFile = new TaxFile {Id = Guid.NewGuid(), ExtraTaxFile = new List<ExtraTaxFile>()};
                    if (tax.TaxFile != null)
                    {
                        tax.TaxFile.EngagementBlobId = model.TaxFile.EngagementBlobId;
                        tax.TaxFile.TaxFormBlobId = model.TaxFile.TaxFormBlobId;
                        tax.TaxFile.UserSignedEngagementId = model.TaxFile.UserSignedEngagementId;
                        tax.TaxFile.UserSignedTaxFormId = model.TaxFile.UserSignedTaxFormId;

                        _repository.RemoveRange(tax.TaxFile.ExtraTaxFile);

                        tax.TaxFile.ExtraTaxFile = model.TaxFile.ExtraTaxFile?.Select(e => new ExtraTaxFile
                        {
                            Id = Guid.NewGuid(),
                            BlobId = e.BlobId,
                            Name = e.Name,
                            SetByAdmin = e.SetByAdmin ?? isAdmin,
                            Efile = e.Efile ?? false
                        }).ToList();
                    }
                }

                tax.Amount = model.Amount;
                tax.Title = model.Title;
                tax.Description = model.Description;
                tax.Status = (byte) model.Status;
                tax.Enabled = model.Enabled;

                var users = (await _membershipServiceApi.AuthAuthApiService.Setting(
                    new MembershipService.ApiClient.Models.BaseModel {Id = tax.UserId})).Data;
                if (users == null)
                    return Result<TaxCoreModel>.Failed(Error.WithData(1000, new[] {"Users not found "}));

                await _repository.CommitAsync();
                return Result<TaxCoreModel>.Successful((new TaxCoreModel
                {
                    Id = tax.Id,
                    Title = tax.Title,
                    Description = tax.Description,
                    User = users,
                    TaxFile = tax.TaxFile != null
                        ? new TaxFileModel
                        {
                            EngagementBlobId = tax.TaxFile.EngagementBlobId,
                            TaxFormBlobId = tax.TaxFile.TaxFormBlobId,
                            UserSignedTaxFormId = tax.TaxFile.UserSignedTaxFormId,
                            UserSignedEngagementId = tax.TaxFile.UserSignedEngagementId,
                            ExtraTaxFile = tax.TaxFile.ExtraTaxFile != null && tax.TaxFile.ExtraTaxFile.Any()
                                ? tax.TaxFile.ExtraTaxFile.Select(e => new ExtraTaxFileModel
                                {
                                    Name = e.Name,
                                    BlobId = e.BlobId,
                                    SetByAdmin = e.SetByAdmin != null ? e.SetByAdmin.Value : true,
                                    Efile = e.Efile != null ? e.Efile.Value : false
                                }).ToList()
                                : null
                        }
                        : null,
                    Amount = tax.Amount,
                    CreationDate = tax.CreationDate,
                    Status = (TaxStatus) tax.Status,
                    Enabled = tax.Enabled
                }));
            });
    }
}