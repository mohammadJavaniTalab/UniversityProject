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
using ERP.CoreService.Core.Models.Message;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Enums;
using FilterModel = ERP.CoreService.Core.Models.FilterModel;

namespace ERP.CoreService.Business.Classes
{
    public class MessageBiz : Base, IMessageBiz
    {
        private readonly IRepository _repository;
        private readonly IMembershipServiceApi _membershipServiceApi;
        private readonly CoreSmtpClient _coreSmtpClient;
        private readonly SmsHttpClient _smsHttpClient;

        public MessageBiz(IMapperService mapper, IRepository repository, IMapper autoMapper,CoreSmtpClient coreSmtpClient,SmsHttpClient smsHttpClient,
            ILogger logger, IMembershipServiceApi membershipServiceApi, IGeneralDataService generalDataService) : base(
            mapper, logger,
            generalDataService, autoMapper)
        {
            _smsHttpClient = smsHttpClient;
            _coreSmtpClient = coreSmtpClient;
            _membershipServiceApi = membershipServiceApi;
            _repository = repository;
        }


        public Task<Result<long>> CountByUser(Guid userId)
            => Result<long>.TryAsync(async () =>
            {
                var taxes = await _repository.ListAsNoTrackingAsync<Message>(
                    x => (x.IsRead == null || !x.IsRead) && x.ToUserId == userId,
                    new PagingModel {PageNumber = 0, PageSize = 1});
                if (!taxes.Success || taxes.Items == null)
                    return Result<long>.Successful(0);
                return Result<long>.Successful(taxes.TotalCount);
            });

        public Task<Result<MessageCoreModel>> Edit(UpdateMessageModel model)
            => Result<MessageCoreModel>.TryAsync(async () =>
            {
                var message = (await _repository.FirstOrDefaultAsync<Message>(i => i.Id == model.Id)).Data;
                if (message == null)
                    return Result<MessageCoreModel>.Failed(Error.WithData(1000, new[] {"Message not found "}));

                message.Body = model.Body;
                message.Title = model.Title;
                message.Priority = (byte) model.Priority;
                message.Enabled = model.Enabled;

                await _repository.CommitAsync();
                return Result<MessageCoreModel>.Successful(_autoMapper.Map<MessageCoreModel>(message));
            });

        public Task<ResultList<MessageCoreModel>> List(FilterModel model)
            => ResultList<MessageCoreModel>.TryAsync(async () =>
            {
                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);
                var messages = new ResultList<Message>();
                if (isAdmin)
                    messages = (await _repository.ListAsync<Message>(i =>
                            i.FromUserId == generalDataService.User.Id || i.ToUserId == Guid.Empty ||
                            i.ToUserId == generalDataService.User.Id
                            && (model.Status == null || i.Priority == model.Status)
                            && (model.Enabled == null || i.Enabled == model.Enabled)
                            && (string.IsNullOrEmpty(model.Keyword) || model.Keyword == i.Title),
                        new PagingModel {PageNumber = 0, PageSize = 1000}));
                else
                    messages = (await _repository.ListAsync<Message>(i =>
                            i.ToUserId == generalDataService.User.Id
                            && (model.Status == null || i.Priority == model.Status)
                            && (model.Enabled == null || i.Enabled == model.Enabled)
                            && (string.IsNullOrEmpty(model.Keyword) || model.Keyword == i.Title),
                        new PagingModel {PageNumber = 0, PageSize = 1000}));

                if (messages == null)
                    return ResultList<MessageCoreModel>.Failed(Error.WithData(1000, new[] {"Messages not found "}));

                var userIds = messages.Items.SelectMany(m => new List<Guid> {m.FromUserId, m.ToUserId}).ToList();
                var users = (await _membershipServiceApi.SystemUserApiService.ListByIds(userIds)).Data;


                messages.Items.ToList().ForEach(message =>
                {
                    if (message.ToUserId == generalDataService.User.Id || message.ToUserId == Guid.Empty)
                        message.IsRead = true;
                });
                await _repository.CommitAsync();

                return ResultList<MessageCoreModel>.Successful(messages.Items.OrderBy(m => m.CreationDate)
                    .Skip(model.PageSize * model.PageNumber).Take(model.PageSize).Select(message =>
                        new MessageCoreModel
                        {
                            Id = message.Id, Body = message.Body, Title = message.Title,
                            Priority = (MessagePriority) message.Priority,
                            FromUser = users.FirstOrDefault(u => u.Id == message.FromUserId),
                            ToUser = users.FirstOrDefault(u => u.Id == message.ToUserId),
                            Enabled = message.Enabled,
                            CreationDate = message.CreationDate
                        }), messages.TotalCount, model.PageNumber, model.PageSize);
            });

        public Task<Result<MessageCoreModel>> Get(BaseCoreModel coreModel)
            => Result<MessageCoreModel>.TryAsync(async () =>
            {
                var message = (await _repository.FirstOrDefaultAsync<Message>(i => i.Id == coreModel.Id)).Data;
                if (message == null)
                    return Result<MessageCoreModel>.Failed(Error.WithData(1000, new[] {"Message not found "}));

                var userIds = new List<Guid> {message.FromUserId, message.ToUserId};
                var users = (await _membershipServiceApi.SystemUserApiService.ListByIds(userIds)).Data;

                message.IsRead = true;
                await _repository.CommitAsync();


                return Result<MessageCoreModel>.Successful(new MessageCoreModel
                {
                    Id = message.Id, Body = message.Body, Title = message.Title,
                    Priority = (MessagePriority) message.Priority,
                    FromUser = users.FirstOrDefault(u => u.Id == message.FromUserId),
                    ToUser = users.FirstOrDefault(u => u.Id == message.ToUserId),
                    Enabled = message.Enabled
                });
            });

        public Task<Result<Guid>> Add(CreateMessageModel model)
            => Result<Guid>.TryAsync(async () =>
            {
                var message = new Message
                {
                    Id = Guid.NewGuid(), Title = model.Title, CreationDate = DateTime.Now,
                    Body = model.Body, FromUserId = generalDataService.User.Id,
                    ToUserId = model.ToUser != null ? model.ToUser.Value : Guid.Empty,
                    Priority = (byte) model.Priority, IsRead = false
                };
                _repository.Add(message);
                await _repository.CommitAsync();
                
                var toUser = (await _membershipServiceApi.SystemUserApiService.Get(
                    new MembershipService.ApiClient.Models.BaseModel {Id = model.ToUser})).Data;
                if (toUser == null)
                    return Result<Guid>.Failed(Error.WithData(1000,new []{"User not found"}));

//                _coreSmtpClient.Send(toUser.Email,
//                    $"Dear  {toUser.Firstname} {toUser.Lastname} ,\n  you have a new message , please take a time to check your inbox in the system. \n Best Regards",
//                    "You have a new Message ");

//                await _smsHttpClient.Send(toUser.Email,
//                    $"Dear  {toUser.Firstname} {toUser.Lastname} ,\n  you have a new message , please take a time to check your inbox in the system. \n Best Regards");
            
                return Result<Guid>.Successful(message.Id);
            });
        public Task<Result<Guid>> SendAdminMessage(CreateMessageModel model)
            => Result<Guid>.TryAsync(async () =>
            {
                var message = new Message
                {
                    Id = Guid.NewGuid(), Title = model.Title, CreationDate = DateTime.Now,
                    Body = model.Body, FromUserId = generalDataService.User.Id,
                    ToUserId = model.ToUser != null ? model.ToUser.Value : Guid.Empty,
                    Priority = (byte) model.Priority, IsRead = false
                };
                _repository.Add(message);
                await _repository.CommitAsync();
                
                var toUser = (await _membershipServiceApi.SystemUserApiService.Get(
                    new MembershipService.ApiClient.Models.BaseModel {Id = model.ToUser})).Data;
                if (toUser == null)
                    return Result<Guid>.Failed(Error.WithData(1000,new []{"User not found"}));

//                _coreSmtpClient.Send(toUser.Email,
//                    $"Dear  {toUser.Firstname} {toUser.Lastname} ,\n  you have a new message , please take a time to check your inbox in the system. \n Best Regards",
//                    "You have a new Message ");

//                await _smsHttpClient.Send(toUser.Email,
//                    $"Dear  {toUser.Firstname} {toUser.Lastname} ,\n  you have a new message , please take a time to check your inbox in the system. \n Best Regards");
            
                return Result<Guid>.Successful(message.Id);
            });
    }
}