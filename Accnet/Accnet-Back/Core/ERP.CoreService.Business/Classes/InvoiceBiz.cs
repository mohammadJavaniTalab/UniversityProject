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
using ERP.CoreService.Core.Base;
using ERP.CoreService.Core.Models;
using ERP.CoreService.Core.Models.Invoice;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Enums;
using ERP.MembershipService.ApiClient.Models;
using FilterModel = ERP.CoreService.Core.Models.FilterModel;

namespace ERP.CoreService.Business.Classes
{
    public class InvoiceBiz : Base, IInvoiceBiz
    {
        private readonly IRepository _repository;
        private readonly IMembershipServiceApi _membershipServiceApi;
        private readonly CoreSmtpClient _coreSmtpClient;
        private readonly SmsHttpClient _smsHttpClient;

        public InvoiceBiz(IMapperService mapper, IRepository repository, IMapper autoMapper,
            IMembershipServiceApi membershipServiceApi, CoreSmtpClient coreSmtpClient, SmsHttpClient smsHttpClient,
            ILogger logger, IGeneralDataService generalDataService) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _smsHttpClient = smsHttpClient;
            _coreSmtpClient = coreSmtpClient;
            _membershipServiceApi = membershipServiceApi;
            _repository = repository;
        }

        public Task<Result<InvoiceCoreModel>> Edit(UpdateInvoiceModel model)
            => Result<InvoiceCoreModel>.TryAsync(async () =>
            {
                var invoice = (await _repository.FirstOrDefaultAsync<Invoice>(i => i.Id == model.Id, i => i.UserSurvey))
                    .Data;
                if (invoice == null)
                    return Result<InvoiceCoreModel>.Failed(Error.WithData(1000, new[] {"invoice not found "}));

                var profile =
                    await _membershipServiceApi.AuthAuthApiService.Profile(new BaseModel {Id = invoice.UserId});

                if (model.Status != (InvoiceStatus) invoice.Status && model.Status == InvoiceStatus.Pending &&
                    model.Enabled)
                    _coreSmtpClient.SendInvoiceReady(profile.Data.Email, profile.Data.Firstname+" "+profile.Data.Lastname);

                invoice.Amount = model.Amount + model.Amount * 5 / 100;
                invoice.TaxAmount = model.Amount * 5 / 100;
                invoice.Title = model.Title;
                invoice.Description = model.Description;
                invoice.Amount = model.Amount;
                if (model.Status == InvoiceStatus.Paid)
                {
                    invoice.IsPaid = true;

                    if (invoice.UserSurvey.Any())
                    {
                        _coreSmtpClient.SendPaysForInvoicesNotif("notifications@accnetonline.com",
                            profile.Data.Username,
                            DateTime.Now.ToString("F"));
                    }
                }

                invoice.Status = (byte) model.Status;
                invoice.Enabled = model.Enabled;

                await _repository.CommitAsync();
                return Result<InvoiceCoreModel>.Successful(_autoMapper.Map<InvoiceCoreModel>(invoice));
            });

        public Task<ResultList<InvoiceCoreModel>> List(FilterModel model)
            => ResultList<InvoiceCoreModel>.TryAsync(async () =>
            {
                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);
                var invoices = new ResultList<Invoice>();
                if (isAdmin)
                    invoices = (await _repository.ListAsNoTrackingAsync<Invoice>(i =>
                            (string.IsNullOrEmpty(model.Keyword) || model.Keyword == i.Title)
                            && (model.Status == null || i.Status == model.Status)
                            && (model.Enabled == null || i.Enabled == model.Enabled),
                        new PagingModel {PageNumber = 0, PageSize = 1000}
                    ));
                else
                    invoices = (await _repository.ListAsNoTrackingAsync<Invoice>(i =>
                            i.UserId == generalDataService.User.Id && i.Enabled
                        // (string.IsNullOrEmpty(model.Keyword) || model.Keyword == i.Title)
                        // && (model.Status == null || i.Status == model.Status)
                        , new PagingModel {PageNumber = 0, PageSize = 1000}
                    ));


                try
                {
                    if (!isAdmin)
                    {
                        var linkedUsers = (await _membershipServiceApi.MembershipLinkedUserApiService.ListByUser(
                            new MembershipService.ApiClient.Models.BaseModel
                            {
                                Id = generalDataService.User.Id
                            })).Data.Select(a => a.FirstUser.Id).ToList();

                        var linkedUserInvoices = (await _repository.ListAsync<Invoice>(i =>
                                linkedUsers.Contains(i.UserId) &&
                                (string.IsNullOrEmpty(model.Keyword) || model.Keyword == i.Title),
                            new PagingModel {PageNumber = 0, PageSize = 1000})).Items.ToList();
                        var merged = new List<Invoice>();
                        merged.AddRange(linkedUserInvoices);
                        merged.AddRange(invoices.Items.ToList());
                        invoices.Items = merged.AsEnumerable();
                    }
                }
                catch (Exception e)
                {
                }

                if (invoices == null)
                    return ResultList<InvoiceCoreModel>.Failed(Error.WithData(1000, new[] {"invoices not found "}));


                var userIds = invoices.Items.Select(i => i.UserId).ToList();
                var users = (await _membershipServiceApi.SystemUserApiService.ListByIds(userIds)).Data;
                if (users == null)
                    return ResultList<InvoiceCoreModel>.Failed(Error.WithData(1000, new[] {"Users not found "}));

                return ResultList<InvoiceCoreModel>.Successful(invoices.Items.OrderBy(a => a.CreationDate).Reverse()
                    .Skip(model.PageNumber * model.PageSize).Take(model.PageSize).Select(invoice => new InvoiceCoreModel
                    {
                        Id = invoice.Id, Amount = invoice.Amount, Description = invoice.Description,
                        CreationDate = invoice.CreationDate,
                        Status = (InvoiceStatus) invoice.Status, Title = invoice.Title,
                        Enabled = invoice.Enabled,
                        User = users.FirstOrDefault(u => u.Id == invoice.UserId)
                    }), invoices.TotalCount, model.PageNumber, model.PageSize);
            });

        public Task<Result<InvoiceCoreModel>> Get(BaseCoreModel coreModel)
            => Result<InvoiceCoreModel>.TryAsync(async () =>
            {
                var invoice = (await _repository.FirstOrDefaultAsync<Invoice>(i => i.Id == coreModel.Id)).Data;
                if (invoice == null)
                    return Result<InvoiceCoreModel>.Failed(Error.WithData(1000, new[] {"Invoice not found "}));

                var user = (await _membershipServiceApi.AuthAuthApiService.Setting(
                    new MembershipService.ApiClient.Models.BaseModel {Id = invoice.UserId})).Data;
                if (user == null)
                    return Result<InvoiceCoreModel>.Failed(Error.WithData(1000, new[] {"User not found "}));

                return Result<InvoiceCoreModel>.Successful(new InvoiceCoreModel
                {
                    Id = invoice.Id, Amount = invoice.Amount, Description = invoice.Description,
                    Status = (InvoiceStatus) invoice.Status, Title = invoice.Title, User = user,
                    CreationDate = invoice.CreationDate,
                    Enabled = invoice.Enabled
                });
            });

        public Task<Result<long>> CountByUser(Guid userId)
            => Result<long>.TryAsync(async () =>
            {
                var taxes = await _repository.ListAsNoTrackingAsync<Invoice>(
                    x => x.Status != (int) InvoiceStatus.Paid && x.UserId == userId && x.Enabled,
                    new PagingModel {PageNumber = 0, PageSize = 1});
                if (!taxes.Success || taxes.Items == null)
                    return Result<long>.Successful(0);
                return Result<long>.Successful(taxes.TotalCount);
            });

        public Task<Result<Guid>> Add(CreateInvoiceModel model, UserSurvey userSurvey = null)
            => Result<Guid>.TryAsync(async () =>
            {
                var user = (await _membershipServiceApi.SystemUserApiService.Get(
                    new MembershipService.ApiClient.Models.BaseModel {Id = model.UserId})).Data;
                if (user == null)
                    return Result<Guid>.Failed(Error.WithCode(ErrorCodes.NotFound));

                var invoice = new Invoice
                {
                    Id = Guid.NewGuid(), Amount = model.Amount + model.Amount * 5 / 100,
                    TaxAmount = model.Amount * 5 / 100, CreationDate = DateTime.Now,
                    UserId = model.UserId, Enabled = model.Enabled,
                    Description = model.Description, Title = model.Title, Status = (byte) model.Status
                };

                if (userSurvey != null)
                    invoice.UserSurvey.Add(userSurvey);

                _repository.Add(invoice);
                await _repository.CommitAsync();

                if (userSurvey == null)
                    _coreSmtpClient.SendInvoiceReady(user.Email, user.Firstname+" "+user.Lastname);
                return Result<Guid>.Successful(invoice.Id);
            });
    }
}