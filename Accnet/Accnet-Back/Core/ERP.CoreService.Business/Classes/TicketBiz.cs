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
using ERP.CoreService.Core.Base;
using ERP.CoreService.Core.Models.Comment;
using ERP.CoreService.Core.Models.Ticket;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Enums;
using ERP.MembershipService.ApiClient.Models;
using FilterModel = ERP.CoreService.Core.Models.FilterModel;

namespace ERP.CoreService.Business.Classes
{
    public class TicketBiz : Base, ITicketBiz
    {
        private readonly IRepository _repository;
        private readonly IMembershipServiceApi _membershipServiceApi;
        private readonly CoreSmtpClient _coreSmtpClient;

        public TicketBiz(IMapperService mapper, IRepository repository, IMapper autoMapper,
            IMembershipServiceApi membershipServiceApi, CoreSmtpClient coreSmtpClient,
            ILogger logger, IGeneralDataService generalDataService) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _coreSmtpClient = coreSmtpClient;
            _membershipServiceApi = membershipServiceApi;
            _repository = repository;
        }

        public Task<Result<Guid>> Add(CreateTicketModel model, UserSurvey userSurvey = null, bool sendEmail = true)
            => Result<Guid>.TryAsync(async () =>
            {
                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);

                if (model.UserId == Guid.Empty)
                    model.UserId = generalDataService.User.Id;

                var user = (await _membershipServiceApi.SystemUserApiService.Get(new BaseModel {Id = model.UserId}))
                    .Data;
                var ticket = new Ticket
                {
                    Id = Guid.NewGuid(),
                    CreationDate = DateTime.Now,
                    UserId = !isAdmin ? generalDataService.User.Id : user.Id,
                    RepresentativeId = isAdmin ? generalDataService.User.Id : Guid.Empty,
                    BlobId = model.BlobId,
                    Text = model.Text,
                    Title = model.Title,
                    Active = true,
                    Priority = (byte) model.Priority
                };

                if (userSurvey != null)
                    ticket.UserSurvey.Add(userSurvey);

                _repository.Add(ticket);
                await _repository.CommitAsync();

                
                return Result<Guid>.Successful(ticket.Id);
            });

        public Task<Result<TicketCoreModel>> Get(Core.Models.BaseCoreModel coreModel)
            => Result<TicketCoreModel>.TryAsync(async () =>
            {
                var result =
                    await _repository.FirstOrDefaultAsNoTrackingAsync<Ticket>(s => s.Id == coreModel.Id,
                        t => t.Comment);

                if (!result.Success || result.Data == null)
                    return Result<TicketCoreModel>.Failed(Error.WithData(1000, new[] {"Ticket Not Found"}));

                var ticket = result.Data;

                var userIds = new List<Guid> {ticket.UserId};
                if (ticket.RepresentativeId.HasValue)
                    userIds.Add(ticket.RepresentativeId.Value);
                userIds.AddRange(ticket.Comment != null
                    ? ticket.Comment.Select(c => c.UserId).ToList()
                    : new List<Guid>());

                var users = (await _membershipServiceApi.SystemUserApiService.ListByIds(userIds)).Data;

                var ticketModel = new TicketCoreModel
                {
                    Id = ticket.Id,
                    Title = ticket.Title,
                    Text = ticket.Text,
                    User = users.FirstOrDefault(u => u.Id == ticket.UserId),
                    Representative = ticket.RepresentativeId.HasValue
                        ? users.FirstOrDefault(u => u.Id == ticket.RepresentativeId.Value)
                        : null,
                    BlobId = ticket.BlobId,
                    CreationDate = ticket.CreationDate,
                    Priority = (TicketPriority) ticket.Priority,
                    Active = ticket.Active,
                    Comment = ticket.Comment?.Select(c => new CommentCoreModel
                    {
                        Id = c.Id,
                        BlobId = c.BlobId,
                        CreationDate = c.CreationDate,
                        Text = c.Text,
                        User = users.FirstOrDefault(u => u.Id == c.UserId)
                    }).ToList(),
                };
                return Result<TicketCoreModel>.Successful(ticketModel);
            });

        public Task<ResultList<TicketCoreModel>> List(FilterModel model)
            => ResultList<TicketCoreModel>.TryAsync(async () =>
            {
                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);
                var tickets = new List<Ticket>();
                if (isAdmin)
                {
                    var list = await _repository.ListAsNoTrackingAsync<Ticket>(i =>
                            (string.IsNullOrEmpty(model.Keyword) || model.Keyword == i.Title) &&
                            (model.UserId == null || i.UserId == model.UserId.Value) &&
                            (model.CreationDate == null ||
                             model.CreationDate.Value.ToString("d") == i.CreationDate.ToString("d")),
                        new PagingModel {PageSize = 1000, PageNumber = 0}, t => t.Comment);
                    tickets = list.Items.ToList();
                }

                else
                {
                    var list = await _repository.ListAsNoTrackingAsync<Ticket>(i =>
                            i.UserId == generalDataService.User.Id &&
                            (string.IsNullOrEmpty(model.Keyword) || model.Keyword == i.Title),
                        new PagingModel {PageSize = 1000, PageNumber = 0}, t => t.Comment);
                    tickets = list.Items.ToList();
                    tickets = tickets.Where(t => t.Title != "Survey").ToList();
                }

                if (tickets == null)
                    return ResultList<TicketCoreModel>.Failed(Error.WithData(1000, new[] {"Tickets Not Found"}));

                var users = (await _membershipServiceApi.SystemUserApiService.ListByIds(tickets
                    .Select(a => a.UserId)
                    .Union(tickets
                        .Select(a => a.RepresentativeId != null ? a.RepresentativeId.Value : Guid.Empty)
                        .Where(a => a != Guid.Empty)).Union(tickets?.SelectMany(t => t.Comment)?.Select(t => t.UserId))
                    .ToList())).Data;

                var ticketModels = tickets.OrderBy(t => t.CreationDate).Reverse().Take(model.PageSize)
                    .Skip(model.PageSize * model.PageNumber).Select(ticket => new TicketCoreModel
                    {
                        Id = ticket.Id,
                        Title = ticket.Title,
                        Text = ticket.Text,
                        User = users.FirstOrDefault(u => u.Id == ticket.UserId),
                        Representative = users.FirstOrDefault(u => u.Id == ticket.RepresentativeId),
                        BlobId = ticket.BlobId,
                        Active = ticket.Active,
                        CreationDate = ticket.CreationDate,
                        Priority = (TicketPriority) ticket.Priority,
                        Comment = ticket.Comment?.Select(c => new CommentCoreModel
                        {
                            Id = c.Id,
                            BlobId = c.BlobId,
                            CreationDate = c.CreationDate,
                            Text = c.Text,
                            User = users.FirstOrDefault(u => u.Id == c.UserId)
                        }).ToList(),
                    });
                return ResultList<TicketCoreModel>.Successful(ticketModels);
            });

        public Task<Result<TicketCoreModel>> Edit(UpdateTicketModel model)
            => Result<TicketCoreModel>.TryAsync(async () =>
            {
                
                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);

                var ticket = (await _repository.FirstOrDefaultAsync<Ticket>(i => i.Id == model.Id)).Data;
                if (ticket == null)
                    return Result<TicketCoreModel>.Failed(Error.WithData(1000, new[] {"Ticket Not Found"}));

                ticket.Text = model.Text;
                ticket.Title = model.Title;
                ticket.Active = model.Active;
                ticket.BlobId = model.BlobId;
                ticket.Priority = (byte) model.Priority;
                ticket.RepresentativeId = model.RepresentativeId;


                await _repository.CommitAsync();

                var userIds = new List<Guid> {ticket.UserId};
                if (ticket.RepresentativeId.HasValue)
                    userIds.Add(ticket.RepresentativeId.Value);
                userIds.AddRange(ticket.Comment != null
                    ? ticket.Comment.Select(c => c.UserId).ToList()
                    : new List<Guid>());
                var users = (await _membershipServiceApi.SystemUserApiService.ListByIds(userIds)).Data;
                var user = users.FirstOrDefault(u => u.Id == ticket.UserId);


                return Result<TicketCoreModel>.Successful(new TicketCoreModel
                {
                    Id = ticket.Id,
                    BlobId = ticket.BlobId,
                    Priority = (TicketPriority) ticket.Priority,
                    Active = ticket.Active,
                    Text = ticket.Text,
                    CreationDate = ticket.CreationDate,
                    User = user,
                    Representative = ticket.RepresentativeId.HasValue
                        ? users.FirstOrDefault(u => u.Id == ticket.RepresentativeId.Value)
                        : null,
                    Title = ticket.Text,
                    Comment = ticket.Comment?.Select(c => new CommentCoreModel
                    {
                        Id = c.Id,
                        BlobId = c.BlobId,
                        CreationDate = c.CreationDate,
                        Text = c.Text,
                        User = users.FirstOrDefault(u => u.Id == c.UserId)
                    }).ToList(),
                });
            });
    }
}