using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Services;
using ERP.CoreService.Business.Interfaces;
using ERP.CoreService.Business.Services.Email;
using ERP.CoreService.Core.Models.Comment;
using ERP.CoreService.DataAccess.EFModels;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Enums;
using ERP.MembershipService.ApiClient.Models;

namespace ERP.CoreService.Business.Classes
{
    public class CommentBiz : Base, ICommentBiz
    {
        private readonly IRepository _repository;
        private readonly IMembershipServiceApi _membershipServiceApi;
        private readonly CoreSmtpClient _coreSmtpClient;

        public CommentBiz(IMapperService mapper, IRepository repository, IMapper autoMapper,
            IMembershipServiceApi membershipServiceApi,CoreSmtpClient coreSmtpClient,
            ILogger logger, IGeneralDataService generalDataService) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _coreSmtpClient = coreSmtpClient;
            _membershipServiceApi = membershipServiceApi;
            _repository = repository;
        }

        public Task<Result<Guid>> Add(CreateCommentModel model)
            => Result<Guid>.TryAsync(async () =>
            {
                
                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);

                var ticket = (await _repository.FirstOrDefaultAsync<Ticket>(t => t.Id == model.TicketId)).Data;

                if (ticket == null)
                    return Result<Guid>.Failed(Error.WithData(1000, new[] {"Ticket Not Found "}));
                var comment = new Comment
                {
                    Id = Guid.NewGuid(),
                    Text = model.Text,
                    Ticket = ticket,
                    CreationDate = DateTime.Now,
                    BlobId = model.BlobId,
                    UserId = generalDataService.User.Id
                };

                var profile = await _membershipServiceApi.AuthAuthApiService.Profile(new BaseModel {Id = ticket.UserId});

                if (isAdmin)
                    _coreSmtpClient.SendTicketResponse(profile.Data.Email,
                        profile.Data.Firstname + " " + profile.Data.Lastname);
                
                _repository.Add(comment);
                await _repository.CommitAsync();

                return Result<Guid>.Successful(comment.Id);
            });

        public Task<Result<CommentCoreModel>> Edit(UpdateCommentModel model)
            => Result<CommentCoreModel>.TryAsync(async () =>
            {
                var comment = (await _repository.FirstOrDefaultAsync<Comment>(i => i.Id == model.Id)).Data;
                if (comment == null)
                    return Result<CommentCoreModel>.Failed(Error.WithData(1000, new[] {"Comment Not Found"}));

                comment.Text = model.Text;
                comment.BlobId = model.BlobId;
                comment.BlobId = model.BlobId;

                await _repository.CommitAsync();
                return Result<CommentCoreModel>.Successful(_autoMapper.Map<CommentCoreModel>(comment));
            });
    }
}