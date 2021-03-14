using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Services;
using ERP.MembershipService.Business.Interfaces.Shared;
using ERP.MembershipService.Core.Base;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Feature;
using ERP.MembershipService.Core.Models.Organization;
using ERP.MembershipService.Core.Models.Role;
using ERP.MembershipService.Core.Models.User;
using ERP.MembershipService.DataAccess.EFModels;

namespace ERP.MembershipService.Business.Classes.Shared
{
    public class LinkedUserBiz : Base, ILinkedUserBiz
    {
        private readonly IRepository _repository;
        private readonly IUserBiz _userBiz;

        public LinkedUserBiz(IMapperService mapper, IRepository repository, IMapper autoMapper, IUserBiz userBiz,
            ILogger logger, IGeneralDataService generalDataService) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _userBiz = userBiz;
            _repository = repository;
        }

        public Task<Result<LinkedUserModel>> Get(BaseModel model)
            => Result<LinkedUserModel>.TryAsync(async () =>
            {
                var result =
                    await _repository.FirstOrDefaultAsNoTrackingAsync<LinkedUser>(u => u.Id == model.Id,
                        u => u.FirstUser, u => u.SecondUser);
                if (!result.Success || result.Data == null)
                    return Result<LinkedUserModel>.Failed(Error.WithCode(ErrorCodes.UserNotFound));

                var linkedUser = result.Data;
                return Result<LinkedUserModel>.Successful(new LinkedUserModel
                {
                    Id = linkedUser.Id,
                    Status = (LinkStatus) linkedUser.LinkStatus,
                    RelationType = linkedUser.RelationType,
                    FirstUser = new LightUserModel
                    {
                        Id = linkedUser.FirstUser.Id,
                        Firstname = linkedUser.FirstUser.Firstname,
                        Lastname = linkedUser.FirstUser.Lastname,
                        Username = linkedUser.FirstUser.Username,
                        Gender = linkedUser.FirstUser.Gender,
                        Role = new RoleModel
                        {
                            Id = linkedUser.FirstUser.Role.Id,
                            Name = linkedUser.FirstUser.Role.Name,
                            Feature = new List<FeatureModel>()
                        }
                    },
                    SecondUser = new LightUserModel
                    {
                        Id = linkedUser.SecondUser.Id,
                        Firstname = linkedUser.SecondUser.Firstname,
                        Lastname = linkedUser.SecondUser.Lastname,
                        Username = linkedUser.SecondUser.Username,
                        Gender = linkedUser.SecondUser.Gender,
                        Role = new RoleModel
                        {
                            Id = linkedUser.SecondUser.Role.Id,
                            Name = linkedUser.SecondUser.Role.Name,
                            Feature = new List<FeatureModel>()
                        }
                    },
                });
            });

        public Task<Result<Guid>> Add(CreateLinkedUserModel model)
            => Result<Guid>.TryAsync(async () =>
            {
                var LinkedUser = new LinkedUser
                {
                    Id = Guid.NewGuid(), FirstUserId = model.FirstUserId ?? generalDataService.User.Id,
                    SecondUserId = model.SecondUserId, CreationDate = DateTime.Now,
                    LinkStatus = (byte) LinkStatus.Pending
                };

                _repository.Add(LinkedUser);
                await _repository.CommitAsync();
                return Result<Guid>.Successful(LinkedUser.Id);
            });

        public Task<ResultList<LinkedUserModel>> List(FilterModel model)
            => ResultList<LinkedUserModel>.TryAsync(async () =>
            {
                ResultList<LinkedUser> resultList = null;

                var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);

                if (isAdmin)
                    resultList = await _repository.ListAsNoTrackingAsync<LinkedUser>(
                        l => model.Status == null || l.LinkStatus == model.Status, model, u =>
                            u.FirstUser.Role, u => u.SecondUser.Role);
                else
                    resultList = await _repository.ListAsNoTrackingAsync<LinkedUser>(
                        l => (l.FirstUserId == model.Id ||
                              l.SecondUserId == model.Id) && model.Status == null ||
                             l.LinkStatus == model.Status, model, u =>
                            u.FirstUser.Role, u => u.SecondUser.Role);

                if (!resultList.Success || resultList.Items == null)
                    return ResultList<LinkedUserModel>.Failed(Error.WithCode(ErrorCodes.NotFound));

                return ResultList<LinkedUserModel>.Successful(resultList.Items.Select(linkedUser =>
                    new LinkedUserModel
                    {
                        Id = linkedUser.Id,
                        Status = (LinkStatus) linkedUser.LinkStatus,
                        RelationType = linkedUser.RelationType,
                        FirstUser = new LightUserModel
                        {
                            Id = linkedUser.FirstUser.Id,
                            Firstname = linkedUser.FirstUser.Firstname,
                            Lastname = linkedUser.FirstUser.Lastname,
                            Username = linkedUser.FirstUser.Username,
                            Gender = linkedUser.FirstUser.Gender,
                            Role = new RoleModel
                            {
                                Id = linkedUser.FirstUser.Role.Id,
                                Name = linkedUser.FirstUser.Role.Name,
                                Feature = new List<FeatureModel>()
                            }
                        },
                        SecondUser = new LightUserModel
                        {
                            Id = linkedUser.SecondUser.Id,
                            Firstname = linkedUser.SecondUser.Firstname,
                            Lastname = linkedUser.SecondUser.Lastname,
                            Username = linkedUser.SecondUser.Username,
                            Gender = linkedUser.SecondUser.Gender,
                            Role = new RoleModel
                            {
                                Id = linkedUser.SecondUser.Role.Id,
                                Name = linkedUser.SecondUser.Role.Name,
                                Feature = new List<FeatureModel>()
                            }
                        },
                    }
                ), resultList.TotalCount, resultList.PageNumber, resultList.PageSize);
            });

        public Task<Result<IList<LinkedUserModel>>> ListAll()
            => Result<IList<LinkedUserModel>>.TryAsync(async () =>
            {
                var resultList = await _repository.ListAsNoTrackingAsync<LinkedUser>(u =>
                            u.FirstUser.Role, u => u.SecondUser.Role);

                if (!resultList.Success || resultList.Data == null)
                    return Result<IList<LinkedUserModel>>.Failed(Error.WithCode(ErrorCodes.NotFound));

                return Result<IList<LinkedUserModel>>.Successful(resultList.Data.Select(linkedUser =>
                    new LinkedUserModel
                    {
                        Id = linkedUser.Id,
                        Status = (LinkStatus) linkedUser.LinkStatus,
                        RelationType = linkedUser.RelationType,
                        FirstUser = new LightUserModel
                        {
                            Id = linkedUser.FirstUser.Id,
                            Firstname = linkedUser.FirstUser.Firstname,
                            Lastname = linkedUser.FirstUser.Lastname,
                            Username = linkedUser.FirstUser.Username,
                            Gender = linkedUser.FirstUser.Gender,
                            Role = new RoleModel
                            {
                                Id = linkedUser.FirstUser.Role.Id,
                                Name = linkedUser.FirstUser.Role.Name,
                                Feature = new List<FeatureModel>()
                            }
                        },
                        SecondUser = new LightUserModel
                        {
                            Id = linkedUser.SecondUser.Id,
                            Firstname = linkedUser.SecondUser.Firstname,
                            Lastname = linkedUser.SecondUser.Lastname,
                            Username = linkedUser.SecondUser.Username,
                            Gender = linkedUser.SecondUser.Gender,
                            Role = new RoleModel
                            {
                                Id = linkedUser.SecondUser.Role.Id,
                                Name = linkedUser.SecondUser.Role.Name,
                                Feature = new List<FeatureModel>()
                            }
                        },
                    }
                ).ToList());
            });

        public Task<Result<IList<LinkedUserModel>>> ListByUser(BaseModel model)
            => Result<IList<LinkedUserModel>>.TryAsync(async () =>
            {
                if (model.Id == null)
                    model.Id = generalDataService.User.Id;
                var resultList = await _repository.ListAsNoTrackingAsync<LinkedUser>(
                    u => u.FirstUserId == model.Id || u.SecondUserId == model.Id, u =>
                        u.FirstUser.Role, u => u.SecondUser.Role);

                if (!resultList.Success || resultList.Data == null)
                    return Result<IList<LinkedUserModel>>.Failed(Error.WithCode(ErrorCodes.NotFound));

                return Result<IList<LinkedUserModel>>.Successful(resultList.Data.Select(linkedUser =>
                    new LinkedUserModel
                    {
                        Id = linkedUser.Id,
                        Status = (LinkStatus) linkedUser.LinkStatus,
                        RelationType = linkedUser.RelationType,
                        FirstUser = new LightUserModel
                        {
                            Id = linkedUser.FirstUser.Id,
                            Firstname = linkedUser.FirstUser.Firstname,
                            Lastname = linkedUser.FirstUser.Lastname,
                            Username = linkedUser.FirstUser.Username,
                            Gender = linkedUser.FirstUser.Gender,
                            Role = new RoleModel
                            {
                                Id = linkedUser.FirstUser.Role.Id,
                                Name = linkedUser.FirstUser.Role.Name,
                                Feature = new List<FeatureModel>()
                            }
                        },
                        SecondUser = new LightUserModel
                        {
                            Id = linkedUser.SecondUser.Id,
                            Firstname = linkedUser.SecondUser.Firstname,
                            Lastname = linkedUser.SecondUser.Lastname,
                            Username = linkedUser.SecondUser.Username,
                            Gender = linkedUser.SecondUser.Gender,
                            Role = new RoleModel
                            {
                                Id = linkedUser.SecondUser.Role.Id,
                                Name = linkedUser.SecondUser.Role.Name,
                                Feature = new List<FeatureModel>()
                            }
                        },
                    }
                ).ToList());
            });

        public Task<Result<IList<LinkedFullUserModel>>> ListByUserFullModel(BaseModel model)
            => Result<IList<LinkedFullUserModel>>.TryAsync(async () =>
            {
                if (model.Id == null)
                    model.Id = generalDataService.User.Id;
                var resultList = await _repository.ListAsNoTrackingAsync<LinkedUser>(
                    u => u.FirstUserId == model.Id || u.SecondUserId == model.Id, u =>
                        u.FirstUser.Role, u => u.SecondUser.Role);

                if (!resultList.Success || resultList.Data == null)
                    return Result<IList<LinkedFullUserModel>>.Failed(Error.WithCode(ErrorCodes.NotFound));

                return Result<IList<LinkedFullUserModel>>.Successful(resultList.Data.Select(linkedUser =>
                    new LinkedFullUserModel
                    {
                        Id = linkedUser.Id,
                        Status = (LinkStatus) linkedUser.LinkStatus,
                        RelationType = linkedUser.RelationType,
                        FirstUser = new FullUserModel
                        {
                            Id = linkedUser.FirstUser.Id,
                            Firstname = linkedUser.FirstUser.Firstname,
                            Lastname = linkedUser.FirstUser.Lastname,
                            Username = linkedUser.FirstUser.Username,
                            Address = linkedUser.FirstUser.Address,
                            City = linkedUser.FirstUser.City,
                            Province = linkedUser.FirstUser.Province,
                            PoBox = linkedUser.FirstUser.PoBox,
                            PostalCode = linkedUser.FirstUser.PostalCode,
                            DateOfBirth = linkedUser.FirstUser.DateOfBirth,
                            Gender = linkedUser.FirstUser.Gender,
                            Email = linkedUser.FirstUser.Email,
                            SinNumber = linkedUser.FirstUser.SinNumber,
                            Mobile = linkedUser.FirstUser.Mobile,
                            Role = new RoleModel
                            {
                                Id = linkedUser.FirstUser.Role.Id,
                                Name = linkedUser.FirstUser.Role.Name,
                                Feature = new List<FeatureModel>()
                            }
                        },
                        SecondUser = new FullUserModel
                        {
                            Id = linkedUser.SecondUser.Id,
                            Firstname = linkedUser.SecondUser.Firstname,
                            Lastname = linkedUser.SecondUser.Lastname,
                            Username = linkedUser.SecondUser.Username,
                            Gender = linkedUser.SecondUser.Gender,
                            DateOfBirth = linkedUser.SecondUser.DateOfBirth,
                            Email = linkedUser.SecondUser.Email,
                            SinNumber = linkedUser.SecondUser.SinNumber,
                            Mobile = linkedUser.SecondUser.Mobile,
                            Role = new RoleModel
                            {
                                Id = linkedUser.SecondUser.Role.Id,
                                Name = linkedUser.SecondUser.Role.Name,
                                Feature = new List<FeatureModel>()
                            }
                        },
                    }
                ).ToList());
            });

        public Task<Result<LinkedUserModel>> Edit(UpdateLinkedUserModel model)
            => Result<LinkedUserModel>.TryAsync(async () =>
            {
                var result =
                    await _repository.FirstOrDefaultAsync<LinkedUser>(u => u.Id == model.Id);
                if (!result.Success || result.Data == null)
                    return Result<LinkedUserModel>.Failed(Error.WithCode(ErrorCodes.UserNotFound));

                var LinkedUser = result.Data;

                LinkedUser.LinkStatus = (byte) model.Status;
                LinkedUser.RelationType = model.RelationType;

                var userIds = new List<Guid> {LinkedUser.FirstUserId, LinkedUser.SecondUserId};

                var users = (await _userBiz.ListByIds(userIds)).Data;
                await _repository.CommitAsync();
                var firstUser = users.FirstOrDefault(u => u.Id == LinkedUser.FirstUserId);

                var secondUser = users.FirstOrDefault(u => u.Id == LinkedUser.SecondUserId);

                return Result<LinkedUserModel>.Successful(new LinkedUserModel
                {
                    Id = LinkedUser.Id,
                    FirstUser = new LightUserModel
                    {
                        Firstname = firstUser.Firstname, Lastname = firstUser.Lastname, Gender = firstUser.Gender,
                        Role = firstUser.Role, Username = firstUser.Username
                    },
                    SecondUser = new LightUserModel
                    {
                        Username = secondUser.Username, Firstname = secondUser.Firstname,
                        Lastname = secondUser.Lastname, Role = secondUser.Role
                    },
                    Status = (LinkStatus) LinkedUser.LinkStatus,
                    RelationType = LinkedUser.RelationType
                });
            });

        public Task<Result> JoinRequest(CreateLinkedUserModel model)
            => Result.TryAsync(async () =>
            {
                var firstUser = (await _repository.FirstOrDefaultAsync<User>(u => u.Id == model.FirstUserId))
                    .Data;
                if (firstUser == null)
                    return Result.Failed(Error.WithCode(ErrorCodes.NotFound));

                var secondUser = (await _repository.FirstOrDefaultAsync<User>(u => u.Id == generalDataService.User.Id))
                    .Data;
                if (secondUser == null)
                    return Result.Failed(Error.WithCode(ErrorCodes.NotFound));


                var linkedUser = new LinkedUser
                {
                    Id = Guid.NewGuid(), CreationDate = DateTime.Now, FirstUser = firstUser, SecondUser = secondUser,
                    RelationType = model.RelationType,
                    LinkStatus = (byte) LinkStatus.Pending
                };
                _repository.Add(linkedUser);
                await _repository.CommitAsync();
                return Result.Successful();
            });

        public async Task<Result> AcceptRequest(BaseModel model)
        {
            var linkedUser = (await _repository.FirstOrDefaultAsync<LinkedUser>(u => u.Id == model.Id))
                .Data;
            if (linkedUser == null)
                return Result.Failed(Error.WithCode(ErrorCodes.NotFound));

            var isAdmin = generalDataService.User.Permissions.Any(p => p == (int) PermissionType.Admin);
            if (!isAdmin)
            {
                if (linkedUser.SecondUserId == generalDataService.User.Id)
                    return Result.Failed(Error.WithData(1000, new[] {"user cant accept link request"}));
                linkedUser.LinkStatus = (byte) LinkStatus.UserAccepted;
            }
            else
            {
                if (linkedUser.LinkStatus != (byte) LinkStatus.UserAccepted)
                    return Result.Failed(Error.WithData(1000, new[] {"User should accpet it first"}));
                linkedUser.LinkStatus = (byte) LinkStatus.AdminAccepted;
            }

            await _repository.CommitAsync();
            return Result.Successful();
        }

        public Task<Result> Remove(BaseModel model)
            => Result.TryAsync(async () =>
            {
                var linked = await _repository.FirstOrDefaultAsync<LinkedUser>(lu => lu.Id == model.Id);
                _repository.Remove(linked.Data);
                await _repository.CommitAsync();
                return Result.Successful();
            });
    }
}