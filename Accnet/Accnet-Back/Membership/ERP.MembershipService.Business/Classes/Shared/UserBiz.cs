using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoreLib;
using CoreLib.Models;
using CoreLib.Services;
using ERP.CoreService.ApiClient;
using ERP.CoreService.ApiClient.Models.User;
using ERP.MembershipService.Business.Interfaces.Shared;
using ERP.MembershipService.Core.Base;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Auth;
using ERP.MembershipService.Core.Models.Feature;
using ERP.MembershipService.Core.Models.Organization;
using ERP.MembershipService.Core.Models.Permission;
using ERP.MembershipService.Core.Models.Role;
using ERP.MembershipService.Core.Models.User;
using ERP.MembershipService.DataAccess.EFModels;

namespace ERP.MembershipService.Business.Classes.Shared
{
    public class UserBiz : Base, IUserBiz
    {
        private readonly ICryptoService _cryptoService;
        private readonly IRepository _repository;
        private readonly IAuthBiz _authBiz;
        private readonly ICoreServiceApi _coreServiceApi;

        public UserBiz(IMapperService mapper, ICoreServiceApi coreServiceApi, ICryptoService cryptoService,
            IRepository repository, IAuthBiz authBiz,
            IMapper autoMapper,
            ILogger logger, IGeneralDataService generalDataService) : base(mapper, logger,
            generalDataService, autoMapper)
        {
            _coreServiceApi = coreServiceApi;
            _authBiz = authBiz;
            _repository = repository;
            _cryptoService = cryptoService;
        }

        public Task<Result<FullUserModel>> Get(BaseModel model)
            => Result<FullUserModel>.TryAsync(async () =>
            {
                var result =
                    await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u => u.Id == model.Id,
                        u => u.LinkedUserFirstUser, u => u.LinkedUserSecondUser,
                        u => u.Receipt,
                        u => u.Role.RoleFeature.Select(rf =>
                            rf.Feature.FeaturePermission.Select(fp => fp.Permission)));
                if (!result.Success || result.Data == null)
                    return Result<FullUserModel>.Failed(Error.WithCode(ErrorCodes.UserNotFound));

                var user = result.Data;
                var uncheckedEntities =
                    (await _coreServiceApi.SystemUserApiService.CountByUser(new CoreService.ApiClient.Models.BaseModel
                        {Id = model.Id})).Data;
                if (uncheckedEntities == null)
                    uncheckedEntities = new UserUncheckedModel();

                var uncheckedRequestLinks =
                    user.LinkedUserFirstUser.Count(c => c.LinkStatus != (int) LinkStatus.AdminAccepted);
                uncheckedRequestLinks +=
                    user.LinkedUserSecondUser.Count(c => c.LinkStatus != (int) LinkStatus.AdminAccepted);

                return Result<FullUserModel>.Successful(new FullUserModel
                {
                    HasDoneSurvey = uncheckedEntities.HasDoneSurvey,
                    UnpaidInvoices = uncheckedEntities.UnpaidInvoices,
                    UncheckedTaxes = uncheckedEntities.UncheckedTaxes,
                    UnreadMessages = uncheckedEntities.UnreadMessages,
                    CompletedProfile = user.Role.Name.ToLower().Contains("admin")
                        ? false
                        : !string.IsNullOrEmpty(user.PostalCode),
                    UncheckedRequestLinks = uncheckedRequestLinks,
                    Id = user.Id,
                    Firstname = user.Firstname,
                    Lastname = user.Lastname,
                    Username = user.Username,
                    Gender = user.Gender,
                    Email = user.Email,
                    Mobile = user.Mobile,
                    AvatarId = user.AvatarId,
                    Address = user.Address,
                    Province = user.Province,
                    City = user.City,
                    PoBox = user.PoBox,
                    PostalCode = user.PostalCode,
                    UnitNumber = user.UnitNumber,
                    MaritalStatus = user.MaritalStatus,
                    DateOfBirth = user.DateOfBirth,
                    SinNumber = user.SinNumber,
                    Receipts = user.Receipt.Select(r => new BlobMembershipModel {Id = r.BlobId}).ToList(),
                    Role = new RoleModel
                    {
                        Id = user.Role.Id,
                        Name = user.Role.Name,
                        Feature = user.Role.RoleFeature.Select(rf => new FeatureModel
                        {
                            Id = rf.Feature.Id,
                            Permissions = rf.Feature.FeaturePermission.Select(fp => new PermissionModel
                                {Id = (PermissionType) fp.Permission.Id, Name = fp.Permission.Name}).ToList()
                        }).ToList()
                    }
                });
            });

        public Task<Result<object>> Register(RegisterModel model)
            => Result<object>.TryAsync(async () =>
            {
                model.Password = _cryptoService.ComputeSha512Hash(model.Password);
                var username = model.FirstName.ToCharArray()[0] + "." + model.LastName;
                var duplicateUsername = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                    u.Username == username);
                if (duplicateUsername.Success && duplicateUsername.Data != null)
                    username = model.FirstName + "." + model.LastName;
                duplicateUsername = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                    u.Username == username);
                if (duplicateUsername.Success && duplicateUsername.Data != null)
                    username = model.FirstName + "." + model.LastName + new Random(1000).Next();

                var duplicateMobile = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                    u.Mobile == model.Mobile);
                if (duplicateMobile.Success && duplicateMobile.Data != null)
                    return Result<object>.Failed(Error.WithData(1000, new[] {"Duplicate Mobile Number "}));

                var duplicateEmail = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                    u.Email == model.Email);
                if (duplicateEmail.Success && duplicateEmail.Data != null)
                    return Result<object>.Failed(Error.WithData(1000, new[] {"Duplicate Email Address "}));

                var result = await _repository.FirstOrDefaultAsync<Role>(r => r.Name == "NormalUser",
                    r => r.RoleFeature.Select(rf => rf.Feature.FeaturePermission.Select(fp => fp.Permission)));
                var role = result.Data;
                var user = new User
                {
                    Id = Guid.NewGuid(),
                    CreationDate = DateTime.Now,
                    Address = "",
                    Email = model.Email,
                    Password = model.Password,
                    Enabled = true,
                    Firstname = model.FirstName,
                    Lastname = model.LastName,
                    Mobile = model.Mobile,
                    Gender = model.Gender,
                    Role = role,
                    Username = username,
                    MaritalStatus = (byte) MaritalStatus.Single,
                };


                var roleModel = new RoleModel
                {
                    Id = role.Id,
                    Name = role.Name,
                    Feature = role.RoleFeature?.Select(rf => new FeatureModel
                    {
                        Id = rf.Feature.Id,
                        Name = rf.Feature.Name,
                        Permissions = rf.Feature?.FeaturePermission?.Select(fp => new PermissionModel
                        {
                            Id = (PermissionType) fp.Permission.Id,
                            Name = fp.Permission.Name
                        }).ToList()
                    }).ToList()
                };

                var token = _authBiz.GenerateJsonWebToken(user, user.Role);
                var response = new
                {
                    Token = token,
                    Username = user.Username,
                    Role = roleModel
                };
                _repository.Add(user);
                try
                {
                    await _repository.CommitAsync();
                }
                catch (Exception e)
                {
                    return Result<object>.Failed(Error.WithData(1000, new[] {"Duplicate username "}));
                }

                return Result<object>.Successful(response);
            });

        public Task<Result<object>> Register(AdvanceRegisterModel model)
            => Result<object>.TryAsync(async () =>
            {
                model.User.Password = _cryptoService.ComputeSha512Hash(model.User.Password);

                var username = model.User.Firstname.ToCharArray()[0] + "." + model.User.Lastname;
                var duplicateUsername = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                    u.Username == username);
                if (duplicateUsername.Success && duplicateUsername.Data != null)
                    username = model.User.Firstname + "." + model.User.Lastname;
                duplicateUsername = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                    u.Username == username);
                if (duplicateUsername.Success && duplicateUsername.Data != null)
                    username = model.User.Firstname + "." + model.User.Lastname + new Random(1000).Next();

                var duplicateMobile = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                    u.Mobile == model.User.Mobile);
                if (duplicateMobile.Success && duplicateMobile.Data != null)
                    return Result<object>.Failed(Error.WithData(1000, new[] {"Duplicate Mobile Number "}));

                var duplicateEmail = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                    u.Email == model.User.Email);
                if (duplicateEmail.Success && duplicateEmail.Data != null)
                    return Result<object>.Failed(Error.WithData(1000, new[] {"Duplicate Email Address "}));

                var result = await _repository.FirstOrDefaultAsync<Role>(r => r.Name == "NormalUser",
                    r => r.RoleFeature.Select(rf => rf.Feature.FeaturePermission.Select(fp => fp.Permission)));
                var role = result.Data;

                var id = Guid.NewGuid();
                var user = new User
                {
                    Id = id,
                    Address = model.User.Address,
                    City = model.User.City,
                    Province = model.User.Province,
                    CreationDate = DateTime.Now,
                    DateOfBirth = model.User.DateOfBirth ?? DateTime.Now,
                    Email = model.User.Email,
                    Enabled = true,
                    SinNumber = model.User.SinNumber,
                    Firstname = model.User.Firstname,
                    Password = _cryptoService.ComputeSha512Hash("" + model.User.DateOfBirth.Value.Year),
                    PostalCode = model.User.PostalCode,
                    Lastname = model.User.Lastname,
                    Latitude = model.User.Latitude,
                    PoBox = model.User.PoBox,
                    Gender = model.User.Gender,
                    Longtitude = model.User.Longtitude,
                    AvatarId = model.User.AvatarId,
                    Receipt = model.User.Receipts != null && model.User.Receipts.Any()
                        ? model.User.Receipts.Select(r => new Receipt {BlobId = r, UserId = id, Id = Guid.NewGuid()})
                            .ToList()
                        : null,
                    Mobile = model.User.Mobile,
                    Role = role,
                    Username = username,
                    MaritalStatus = (byte) MaritalStatus.Single,
                };

                var linkUser = new LinkedUser
                {
                    Id = Guid.NewGuid(),
                    FirstUserId = user.Id,
                    SecondUserId = generalDataService.User.Id,
                    CreationDate = DateTime.Now,
                    RelationType = model.RelationType,
                    LinkStatus = (byte) LinkStatus.Pending
                };

                _repository.Add(user);
                _repository.Add(linkUser);
                await _repository.CommitAsync();

                return Result<object>.Successful(user.Id);
            });

        public Task<Result<Guid>> Add(CreateUserModel model)
            => Result<Guid>.TryAsync(async () =>
            {
                model.Password = _cryptoService.ComputeSha512Hash(model.Password);

                var username = model.Username;
                var duplicateUsername = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                    u.Username == username);
                if (duplicateUsername.Success && duplicateUsername.Data != null)
                    username = model.Firstname.ToCharArray()[0] + model.Firstname.ToCharArray()[1] + model.Lastname;

                var duplicateMobile = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                    u.Mobile == model.Mobile);
                if (duplicateMobile.Success && duplicateMobile.Data != null)
                    return Result<Guid>.Failed(Error.WithData(1000, new[] {"Duplicate Mobile Number "}));

                var duplicateEmail = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                    u.Email == model.Email);
                if (duplicateEmail.Success && duplicateEmail.Data != null)
                    return Result<Guid>.Failed(Error.WithData(1000, new[] {"Duplicate Email Address "}));

                var role = await _repository.FirstOrDefaultAsync<Role>(u =>
                    u.Id == model.RoleId);
                if (!role.Success && role.Data != null)
                    return Result<Guid>.Failed(Error.WithCode(ErrorCodes.InvalidModel));

                var id = Guid.NewGuid();
                var user = new User
                {
                    Id = id,
                    Address = model.Address,
                    Province = model.Province,
                    City = model.City,
                    CreationDate = DateTime.Now,
                    DateOfBirth = model.DateOfBirth ?? DateTime.Now,
                    Email = model.Email,
                    Enabled = true,
                    SinNumber = model.SinNumber,
                    PostalCode = model.PostalCode,
                    Password = model.Password,
                    Firstname = model.Firstname,
                    Lastname = model.Lastname,
                    Latitude = model.Latitude,
                    Longtitude = model.Longtitude,
                    AvatarId = model.AvatarId,
                    Receipt = model.Receipts != null && model.Receipts.Any()
                        ? model.Receipts.Select(r => new Receipt {BlobId = r, UserId = id, Id = Guid.NewGuid()})
                            .ToList()
                        : null,
                    Mobile = model.Mobile,
                    Gender = model.Gender,
                    Role = role.Data,
                    Username = username,
                    MaritalStatus = (byte) MaritalStatus.Single,
                };

                _repository.Add(user);
                await _repository.CommitAsync();

                return Result<Guid>.Successful(user.Id);
            });

        public Task<ResultList<FullUserModel>> List(FilterModel model)
            => ResultList<FullUserModel>.TryAsync(async () =>
            {

                var admin = false;
                if (model.RoleId != null)
                {
                    if (model.RoleId.Value == new Guid("6c98c773-5cf8-4993-b78b-32af01858111"))
                        admin = false;
                    else
                        admin = true;
                }
                ResultList<User> resultList=new ResultList<User>();
                
                if(model.RoleId!=null)
                 resultList = await _repository.ListAsNoTrackingAsync<User>(
                    u => (string.IsNullOrEmpty(model.Keyword) || u.Username.ToLower().Contains(model.Keyword)) &&
                         (model.RoleId == null || admin ? u.RoleId != new Guid("6c98c773-5cf8-4993-b78b-32af01858111") : u.RoleId == model.RoleId),
                    new PagingModel {PageNumber = 0, PageSize = 3000},
                    u =>
                        u.Role);
                else 
                    resultList = await _repository.ListAsNoTrackingAsync<User>(
                        u => (string.IsNullOrEmpty(model.Keyword) || u.Username.ToLower().Contains(model.Keyword)) ,
                        new PagingModel {PageNumber = 0, PageSize = 3000},
                        u =>
                            u.Role);

                if (!resultList.Success || resultList.Items == null)
                    return ResultList<FullUserModel>.Failed(Error.WithCode(ErrorCodes.NotFound));

                return ResultList<FullUserModel>.Successful(resultList.Items.OrderBy(a => a.CreationDate).Reverse()
                    .Skip(model.PageSize * model.PageNumber).Take(model.PageSize).Select(user => new FullUserModel
                    {
                        Id = user.Id,
                        Firstname = user.Firstname,
                        Lastname = user.Lastname,
                        Username = user.Username,
                        Gender = user.Gender,
                        Email = user.Email,
                        Mobile = user.Mobile,
                        AvatarId = user.AvatarId,
                        Address = user.Address,
                        Province = user.Province,
                        City = user.City,
                        PoBox = user.PoBox,
                        Enabled = user.Enabled,
                        PostalCode = user.PostalCode,
                        UnitNumber = user.UnitNumber,
                        MaritalStatus = user.MaritalStatus,
                        DateOfBirth = user.DateOfBirth,
                        SinNumber = user.SinNumber,
                        Receipts = user.Receipt.Select(r => new BlobMembershipModel {Id = r.BlobId}).ToList(),
                        Role = new RoleModel
                        {
                            Id = user.Role.Id,
                            Name = user.Role.Name,
                            Feature = user.Role.RoleFeature.Select(rf => new FeatureModel
                            {
                                Id = rf.Feature.Id,
                                Permissions = rf.Feature.FeaturePermission.Select(fp => new PermissionModel
                                    {Id = (PermissionType) fp.Permission.Id, Name = fp.Permission.Name}).ToList()
                            }).ToList()
                        }
                    }), resultList.TotalCount, model.PageNumber, model.PageSize);
            });

        public Task<Result<LightUserModel>> Edit(UpdateUserModel model)
            => Result<LightUserModel>.TryAsync(async () =>
            {
                var result =
                    await _repository.FirstOrDefaultAsync<User>(u => u.Id == model.Id,
                        u => u.Role.RoleFeature.Select(rf =>
                            rf.Feature.FeaturePermission.Select(fp => fp.Permission)));
                if (!result.Success || result.Data == null)
                    return Result<LightUserModel>.Failed(Error.WithData(1000, new[] {"User not found"}));


                var duplicateUsername = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                    u.Id != result.Data.Id && u.Username == model.Username);
                if (duplicateUsername.Success && duplicateUsername.Data != null)
                    return Result<LightUserModel>.Failed(Error.WithData(1000, new[] {"Duplicate Username "}));

                var duplicateMobile = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                    u.Id != result.Data.Id && u.Mobile == model.Mobile);
                if (duplicateMobile.Success && duplicateMobile.Data != null)
                    return Result<LightUserModel>.Failed(Error.WithData(1000, new[] {"Duplicate Mobile Number "}));

                var duplicateEmail = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                    u.Id != result.Data.Id && u.Email == model.Email);
                if (duplicateEmail.Success && duplicateEmail.Data != null)
                    return Result<LightUserModel>.Failed(Error.WithData(1000, new[] {"Duplicate Email Address "}));

                var user = result.Data;

                user.Address = model.Address;
                user.City = model.City;
                user.Province = model.Province;
                user.Firstname = model.Firstname;
                user.Lastname = model.Lastname;
                user.PoBox = model.PoBox;
                user.SinNumber = model.SinNumber;
                user.UnitNumber = model.UnitNumber;
                user.Email = model.Email;
                user.Username = !string.IsNullOrEmpty(model.Username) ? model.Username : user.Username;
                user.Mobile = model.Mobile;
                user.AvatarId = model.AvatarId;
                user.PostalCode = model.PostalCode;
                user.Receipt = model.Receipts != null && model.Receipts.Any()
                    ? model.Receipts.Select(r => new Receipt {BlobId = r, Id = Guid.NewGuid()}).ToList()
                    : null;
                user.Latitude = model.Latitude;
                user.Longtitude = model.Longtitude;
                user.Gender = model.Gender;
                user.Enabled = model.Enabled;
                user.RoleId = model.RoleId;
                user.DateOfBirth = model.DateOfBirth ?? user.DateOfBirth;
                user.MaritalStatus = (byte) model.MaritalStatus;

                if (!string.IsNullOrEmpty(model.Password))
                {
                    model.Password = _cryptoService.ComputeSha512Hash(model.Password);
                    user.Password = model.Password;
                }

                await _repository.CommitAsync();
                return Result<LightUserModel>.Successful(_autoMapper.Map<LightUserModel>(user));
            });

        public async Task<Result> Delete(BaseModel model)
        {
            var user = await _repository.FirstOrDefaultAsync<User>(u => u.Id == model.Id, u => u.Role, u => u.Receipt,
                u => u.Relatives,
                u => u.LinkedUserFirstUser, u => u.LinkedUserSecondUser);
            if (!user.Success || user.Data == null)
                return Result.Failed(Error.WithData(1000, new[] {"no use found"}));

            if (user.Data.Receipt != null && user.Data.Receipt.Any())
                _repository.RemoveRange(user.Data.Receipt);
            if (user.Data.Relatives != null && user.Data.Relatives.Any())
                _repository.RemoveRange(user.Data.Relatives);
            if (user.Data.LinkedUserFirstUser != null && user.Data.LinkedUserFirstUser.Any())
                _repository.RemoveRange(user.Data.LinkedUserFirstUser);
            if (user.Data.LinkedUserSecondUser != null && user.Data.LinkedUserSecondUser.Any())
                _repository.RemoveRange(user.Data.LinkedUserSecondUser);
            _repository.Remove(user.Data);
            await _repository.CommitAsync();
            return Result.Successful();
        }

        public Task<Result<IList<FullUserModel>>> FullListByIds(IList<Guid> ids)
            => Result<IList<FullUserModel>>.TryAsync(async () =>
            {
                var resultList = await _repository.ListAsNoTrackingAsync<User>(u => ids.Contains(u.Id),
                    u => u.Receipt, u =>
                        u.Role.RoleFeature.Select(r => r.Feature.FeaturePermission.Select(f => f.Permission)));

                if (!resultList.Success || resultList.Data == null)
                    return Result<IList<FullUserModel>>.Failed(Error.WithCode(ErrorCodes.NotFound));

                return Result<IList<FullUserModel>>.Successful(resultList.Data.Select(user => new FullUserModel
                {
                    Id = user.Id,
                    Firstname = user.Firstname,
                    Lastname = user.Lastname,
                    Username = user.Username,
                    Gender = user.Gender,
                    Email = user.Email,
                    Mobile = user.Mobile,
                    AvatarId = user.AvatarId,
                    CreationDate = user.CreationDate,
                    Address = user.Address,
                    Province = user.Province,
                    City = user.City,
                    PoBox = user.PoBox,
                    PostalCode = user.PostalCode,
                    UnitNumber = user.UnitNumber,
                    MaritalStatus = user.MaritalStatus,
                    DateOfBirth = user.DateOfBirth,
                    SinNumber = user.SinNumber,
                    Receipts = user.Receipt.Select(r => new BlobMembershipModel {Id = r.BlobId}).ToList(),
                    Role = new RoleModel
                    {
                        Id = user.Role.Id,
                        Name = user.Role.Name,
                        Feature = user.Role.RoleFeature.Select(rf => new FeatureModel
                        {
                            Id = rf.Feature.Id,
                            Permissions = rf.Feature.FeaturePermission.Select(fp => new PermissionModel
                                {Id = (PermissionType) fp.Permission.Id, Name = fp.Permission.Name}).ToList()
                        }).ToList()
                    }
                }).ToList());
            });

        public Task<Result<IList<LightUserModel>>> ListByIds(IList<Guid> ids)
            => Result<IList<LightUserModel>>.TryAsync(async () =>
            {
                var resultList = await _repository.ListAsNoTrackingAsync<User>(u => ids.Contains(u.Id),
                    u => u.Receipt, u =>
                        u.Role);

                if (!resultList.Success || resultList.Data == null)
                    return Result<IList<LightUserModel>>.Failed(Error.WithCode(ErrorCodes.NotFound));

                return Result<IList<LightUserModel>>.Successful(resultList.Data.Select(user => new LightUserModel
                {
                    Id = user.Id,
                    Firstname = user.Firstname,
                    Lastname = user.Lastname,
                    Username = user.Username,
                    Gender = user.Gender,
                    Role = new RoleModel
                    {
                        Id = user.Role.Id,
                        Name = user.Role.Name,
                        Feature = user.Role.RoleFeature.Select(rf => new FeatureModel
                        {
                            Id = rf.Feature.Id,
                            Permissions = rf.Feature.FeaturePermission.Select(fp => new PermissionModel
                                {Id = (PermissionType) fp.Permission.Id, Name = fp.Permission.Name}).ToList()
                        }).ToList()
                    }
                }).ToList());
            });

        public async Task<Result<FullUserModel>> Profile(BaseModel model)
        {
            return await Get(new BaseModel {Id = model.Id});
        }

        public async Task<Result<LightUserModel>> Setting(BaseModel model)
        {
            var result = await Get(new BaseModel {Id = model.Id});
            if (!result.Success)
                return Result<LightUserModel>.Failed(result.Error);
            return Result<LightUserModel>.Successful(new LightUserModel
            {
                Id = result.Data.Id,
                Firstname = result.Data.Firstname,
                Lastname = result.Data.Lastname,
                Username = result.Data.Username,
                Gender = result.Data.Gender,
                AvatarId = result.Data.AvatarId,
                CompletedProfile = result.Data.CompletedProfile,
                HasDoneSurvey = result.Data.HasDoneSurvey,
                UnpaidInvoices = result.Data.UnpaidInvoices,
                UncheckedTaxes = result.Data.UncheckedTaxes,
                Role = result.Data.Role,
                UnreadMessages = result.Data.UnreadMessages,
                UncheckedRequestLinks = result.Data.UncheckedRequestLinks
            });
        }

        public Task<Result<LightUserModel>> UpdateProfile(UpdateUserProfileModel model)
            => Result<LightUserModel>.TryAsync(async () =>
            {
                var result =
                    await _repository.FirstOrDefaultAsync<User>(u => u.Id == generalDataService.User.Id,
                        u => u.Receipt,
                        u => u.Role.RoleFeature.Select(rf =>
                            rf.Feature.FeaturePermission.Select(fp => fp.Permission)));
                if (!result.Success || result.Data == null)
                    return Result<LightUserModel>.Failed(Error.WithCode(ErrorCodes.UserNotFound));
                var user = result.Data;


                var duplicateEmail =
                    await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                        u.Id != user.Id && model.Email == u.Email);
                if (duplicateEmail.Success && duplicateEmail.Data != null)
                    return Result<LightUserModel>.Failed(Error.WithData(1000, new[] {"duplicate email address"}));

                var duplicateMobile =
                    await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u =>
                        u.Id != user.Id && model.Mobile == u.Mobile);
                if (duplicateMobile.Success && duplicateMobile.Data != null)
                    return Result<LightUserModel>.Failed(Error.WithData(1000, new[] {"duplicate mobile"}));

                _repository.RemoveRange(user.Receipt);

                user.Address = model.Address;
                user.City = model.City;
                user.Province = model.Province;
                user.Email = model.Email;
                user.PostalCode = model.PostalCode;
                user.PoBox = model.PoBox;
                user.Firstname = model.Firstname;
                user.SinNumber = model.SinNumber;
                user.UnitNumber = model.UnitNumber;
                user.UnitNumber = model.UnitNumber;
                user.Lastname = model.Lastname;
                user.Mobile = model.Mobile;
                user.AvatarId = model.AvatarId;
                user.Receipt = model.Receipts == null || !model.Receipts.Any()
                    ? null
                    : model.Receipts.Select(r => new Receipt {BlobId = r, Id = Guid.NewGuid()}).ToList();
                user.Latitude = model.Latitude;
                user.MaritalStatus = (byte) model.MaritalStatus;
                user.Longtitude = model.Longtitude;
                user.Gender = model.Gender;
                user.DateOfBirth = model.DateOfBirth ?? user.DateOfBirth;

                if (!string.IsNullOrEmpty(model.Password))
                {
                    model.Password = _cryptoService.ComputeSha512Hash(model.Password);
                    user.Password = model.Password;
                }

                await _repository.CommitAsync();
                return Result<LightUserModel>.Successful(new LightUserModel
                {
                    Id = user.Id,
                    Firstname = user.Firstname,
                    Lastname = user.Lastname,
                    Username = user.Username,
                    Gender = user.Gender,
                    Role = new RoleModel
                    {
                        Id = user.Role.Id,
                        Name = user.Role.Name,
                        Feature = user.Role.RoleFeature.Select(rf => new FeatureModel
                        {
                            Id = rf.Feature.Id,
                            Permissions = rf.Feature.FeaturePermission.Select(fp => new PermissionModel
                                {Id = (PermissionType) fp.Permission.Id, Name = fp.Permission.Name}).ToList()
                        }).ToList()
                    }
                });
            });


        public async Task<Result<LightUserModel>> Search(SearchUserModel model)
        {
            var result = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(
                u => u.Email == model.Keyword || u.Mobile == model.Keyword
                , u => u.Role);
            if (!result.Success || result.Data == null)
                return Result<LightUserModel>.Failed(Error.WithData(1000, new[] {"User not found"}));

            var user = result.Data;
            return Result<LightUserModel>.Successful(new LightUserModel
            {
                Id = user.Id,
                Firstname = user.Firstname,
                Lastname = user.Lastname,
                Username = user.Username,
                Gender = user.Gender,
                Role = new RoleModel
                {
                    Id = user.Role.Id,
                    Name = user.Role.Name,
                    Feature = new List<FeatureModel>()
                }
            });
        }

        public Task<Result> AddReciept(UpdateUserModel model)
            => Result.TryAsync(async () =>
            {
                var user = await _repository.FirstOrDefaultAsync<User>(u => u.Id == model.Id, u => u.Receipt);
                if (!user.Success || user.Data == null)
                    return Result.Failed(Error.WithData(1000, new[] {"user not found"}));

                if (model.Receipts != null && model.Receipts.Any())
                {
                    if (user.Data.Receipt != null && user.Data.Receipt.Any())
                    {
                        _repository.RemoveRange(user.Data.Receipt);
                        user.Data.Receipt = null;
                    }

                    user.Data.Receipt = model.Receipts.Select(r => new Receipt
                    {
                        Id = Guid.NewGuid(),
                        BlobId = r,
                        UserId = user.Data.Id
                    }).ToList();
                }
                else
                {
                    _repository.RemoveRange(user.Data.Receipt);
                    user.Data.Receipt = null;
                }

                await _repository.CommitAsync();

                return Result.Successful();
            });

        public Task<Result<IList<Guid>>> Reciepts(BaseModel model)
            => Result<IList<Guid>>.TryAsync(async () =>
            {
                var user = await _repository.FirstOrDefaultAsNoTrackingAsync<User>(u => u.Id == model.Id.Value,
                    u => u.Receipt);
                if (user.Data == null)
                    return Result<IList<Guid>>.Failed(Error.WithData(1000, new[] {"User not found"}));
                return Result<IList<Guid>>.Successful(user.Data.Receipt.Select(r => r.BlobId).ToList());
            });
    }
}