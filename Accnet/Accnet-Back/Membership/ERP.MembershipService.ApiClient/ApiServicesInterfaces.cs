using System;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;
using System.Collections.Generic;
using ERP.MembershipService.ApiClient.Models;
using ERP.MembershipService.ApiClient.Enums;

namespace ERP.MembershipService.ApiClient.System
{
    public interface ILinkedUserApiService
    {
        Task<CoreLib.Result<IList<Models.Organization.LinkedFullUserModel>>> ListByUserFullModel(BaseModel model);
        Task<CoreLib.Result<IList<Models.Organization.LinkedUserModel>>> ListAll();
    }
    public interface IUserApiService
    {
        Task<CoreLib.Result<Models.User.FullUserModel>> Get(BaseModel model);
        Task<CoreLib.Result<IList<Models.User.LightUserModel>>> ListByIds(object Ids);
        Task<CoreLib.Result<IList<Models.User.FullUserModel>>> FullListByIds(object Ids);
    }
}
namespace ERP.MembershipService.ApiClient.Membership
{
    public interface IFeatureApiService
    {
        Task<CoreLib.Result<Guid>> Add(Models.Feature.CreateFeatureModel model);
        Task<CoreLib.Result<Models.Feature.FeatureModel>> Get(Models.Feature.FeatureModel model);
        Task<CoreLib.ResultList<Models.Feature.FeatureModel>> List(FilterModel model);
        Task<CoreLib.Result<Models.Feature.FeatureModel>> Edit(Models.Feature.UpdateFeatureModel model);
    }
    public interface ILinkedUserApiService
    {
        Task<CoreLib.Result<Guid>> Add(Models.Organization.CreateLinkedUserModel model);
        Task<CoreLib.Result<Models.Organization.LinkedUserModel>> Get(BaseModel model);
        Task<CoreLib.ResultList<Models.Organization.LinkedUserModel>> List(FilterModel model);
        Task<CoreLib.Result> Remove(BaseModel model);
        Task<CoreLib.Result<IList<Models.Organization.LinkedUserModel>>> ListByUser(BaseModel model);
        Task<CoreLib.Result> JoinRequest(Models.Organization.CreateLinkedUserModel model);
        Task<CoreLib.Result> AcceptRequest(BaseModel model);
        Task<CoreLib.Result<Models.Organization.LinkedUserModel>> Edit(Models.Organization.UpdateLinkedUserModel model);
    }
    public interface IPermissionApiService
    {
        Task<CoreLib.ResultList<Models.Permission.PermissionModel>> List(CoreLib.Models.PagingModel model);
    }
    public interface IRelativeApiService
    {
        Task<CoreLib.Result<Guid>> Add(Models.User.CreateRelativeModel model);
        Task<CoreLib.Result<IList<Models.User.RelativeModel>>> ListByUser(BaseModel model);
        Task<CoreLib.Result<Guid>> Delete(BaseModel model);
    }
    public interface IRoleApiService
    {
        Task<CoreLib.Result<Guid>> Add(Models.Role.CreateRoleModel model);
        Task<CoreLib.Result<Models.Role.RoleModel>> Get(Models.Role.RoleModel model);
        Task<CoreLib.ResultList<Models.Role.RoleModel>> List(FilterModel model);
        Task<CoreLib.Result<Models.Role.RoleModel>> Edit(Models.Role.UpdateRoleModel model);
    }
    public interface IUserApiService
    {
        Task<CoreLib.Result<Guid>> Add(Models.User.CreateUserModel model);
        Task<CoreLib.ResultList<Models.User.FullUserModel>> List(FilterModel model);
        Task<CoreLib.Result<Models.User.LightUserModel>> Search(Models.User.SearchUserModel model);
        Task<CoreLib.Result<Models.User.LightUserModel>> Edit(Models.User.UpdateUserModel model);
        Task<CoreLib.Result> Delete(BaseModel model);
        Task<CoreLib.Result> AddReciept(Models.User.UpdateUserModel model);
    }
}
namespace ERP.MembershipService.ApiClient.Auth
{
    public interface IAuthApiService
    {
        Task<CoreLib.Result<object>> GenerateToken(Models.Auth.LoginModel model);
        Task<CoreLib.Result<object>> RefreshToken(BaseModel model);
        Task<CoreLib.Result<object>> Register(Models.Auth.RegisterModel model);
        Task<CoreLib.Result<object>> Register(Models.Organization.AdvanceRegisterModel model);
        Task<CoreLib.Result<Models.User.LightUserModel>> Setting(BaseModel model);
        Task<CoreLib.Result<Models.User.FullUserModel>> Profile(BaseModel model);
        Task<CoreLib.Result<Models.User.LightUserModel>> UpdateProfile(Models.User.UpdateUserProfileModel model);
        Task<CoreLib.Result<IList<Guid>>> Reciepts(BaseModel model);
        Task<CoreLib.Result<bool>> ChangePassword(Models.Auth.ChangePasswordModel model);
    }
}
namespace ERP.MembershipService.ApiClient
{
    public interface IMembershipServiceApi
    {
     System.LinkedUserApiService SystemLinkedUserApiService {get; set;}
     System.UserApiService SystemUserApiService {get; set;}
     Membership.FeatureApiService MembershipFeatureApiService {get; set;}
     Membership.LinkedUserApiService MembershipLinkedUserApiService {get; set;}
     Membership.PermissionApiService MembershipPermissionApiService {get; set;}
     Membership.RelativeApiService MembershipRelativeApiService {get; set;}
     Membership.RoleApiService MembershipRoleApiService {get; set;}
     Membership.UserApiService MembershipUserApiService {get; set;}
     Auth.AuthApiService AuthAuthApiService {get; set;}
}
}
