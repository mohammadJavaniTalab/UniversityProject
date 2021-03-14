using System;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;
using CoreLib.Services;
using System.Collections.Generic;
using ERP.MembershipService.ApiClient.Models;
using ERP.MembershipService.ApiClient.Enums;
using System.Net.Http;

namespace ERP.MembershipService.ApiClient.System
{
    public class LinkedUserApiService : BaseApiClient, ILinkedUserApiService
    {
        public LinkedUserApiService(string host, string name, string apiKey, ISerializerService serializer, ICompressionService compressionService, IGeneralDataService generalDataService, IHttpClientFactory httpClientFactory) : base(host, name, apiKey, serializer, compressionService, generalDataService, httpClientFactory) { }

        public Task<CoreLib.Result<IList<Models.Organization.LinkedFullUserModel>>> ListByUserFullModel(BaseModel model)
            => base.PostAsync<CoreLib.Result<IList<Models.Organization.LinkedFullUserModel>>>("api/system/linked-user/list-by-user", model);
        public Task<CoreLib.Result<IList<Models.Organization.LinkedUserModel>>> ListAll()
            => base.PostAsync<CoreLib.Result<IList<Models.Organization.LinkedUserModel>>>("api/system/linked-user/lis-all", null);
    }
    public class UserApiService : BaseApiClient, IUserApiService
    {
        public UserApiService(string host, string name, string apiKey, ISerializerService serializer, ICompressionService compressionService, IGeneralDataService generalDataService, IHttpClientFactory httpClientFactory) : base(host, name, apiKey, serializer, compressionService, generalDataService, httpClientFactory) { }

        public Task<CoreLib.Result<Models.User.FullUserModel>> Get(BaseModel model)
            => base.PostAsync<CoreLib.Result<Models.User.FullUserModel>>("api/system/user/get", model);
        public Task<CoreLib.Result<IList<Models.User.LightUserModel>>> ListByIds(object Ids)
            => base.PostAsync<CoreLib.Result<IList<Models.User.LightUserModel>>>("api/system/user/list-by-ids", Ids);
        public Task<CoreLib.Result<IList<Models.User.FullUserModel>>> FullListByIds(object Ids)
            => base.PostAsync<CoreLib.Result<IList<Models.User.FullUserModel>>>("api/system/user/list-by-ids-full", Ids);
    }
}
namespace ERP.MembershipService.ApiClient.Membership
{
    public class FeatureApiService : BaseApiClient, IFeatureApiService
    {
        public FeatureApiService(string host, string name, string apiKey, ISerializerService serializer, ICompressionService compressionService, IGeneralDataService generalDataService, IHttpClientFactory httpClientFactory) : base(host, name, apiKey, serializer, compressionService, generalDataService, httpClientFactory) { }

        public Task<CoreLib.Result<Guid>> Add(Models.Feature.CreateFeatureModel model)
            => base.PostAsync<CoreLib.Result<Guid>>("api/feature/add", model);
        public Task<CoreLib.Result<Models.Feature.FeatureModel>> Get(Models.Feature.FeatureModel model)
            => base.PostAsync<CoreLib.Result<Models.Feature.FeatureModel>>("api/feature/get", model);
        public Task<CoreLib.ResultList<Models.Feature.FeatureModel>> List(FilterModel model)
            => base.PostAsync<CoreLib.ResultList<Models.Feature.FeatureModel>>("api/feature/list", model);
        public Task<CoreLib.Result<Models.Feature.FeatureModel>> Edit(Models.Feature.UpdateFeatureModel model)
            => base.PostAsync<CoreLib.Result<Models.Feature.FeatureModel>>("api/feature/edit", model);
    }
    public class LinkedUserApiService : BaseApiClient, ILinkedUserApiService
    {
        public LinkedUserApiService(string host, string name, string apiKey, ISerializerService serializer, ICompressionService compressionService, IGeneralDataService generalDataService, IHttpClientFactory httpClientFactory) : base(host, name, apiKey, serializer, compressionService, generalDataService, httpClientFactory) { }

        public Task<CoreLib.Result<Guid>> Add(Models.Organization.CreateLinkedUserModel model)
            => base.PostAsync<CoreLib.Result<Guid>>("api/linked-user/add", model);
        public Task<CoreLib.Result<Models.Organization.LinkedUserModel>> Get(BaseModel model)
            => base.PostAsync<CoreLib.Result<Models.Organization.LinkedUserModel>>("api/linked-user/get", model);
        public Task<CoreLib.ResultList<Models.Organization.LinkedUserModel>> List(FilterModel model)
            => base.PostAsync<CoreLib.ResultList<Models.Organization.LinkedUserModel>>("api/linked-user/list", model);
        public Task<CoreLib.Result> Remove(BaseModel model)
            => base.PostAsync<CoreLib.Result>("api/linked-user/remove", model);
        public Task<CoreLib.Result<IList<Models.Organization.LinkedUserModel>>> ListByUser(BaseModel model)
            => base.PostAsync<CoreLib.Result<IList<Models.Organization.LinkedUserModel>>>("api/linked-user/list-by-user", model);
        public Task<CoreLib.Result> JoinRequest(Models.Organization.CreateLinkedUserModel model)
            => base.PostAsync<CoreLib.Result>("api/linked-user/join-request", model);
        public Task<CoreLib.Result> AcceptRequest(BaseModel model)
            => base.PostAsync<CoreLib.Result>("api/linked-user/accept-request", model);
        public Task<CoreLib.Result<Models.Organization.LinkedUserModel>> Edit(Models.Organization.UpdateLinkedUserModel model)
            => base.PostAsync<CoreLib.Result<Models.Organization.LinkedUserModel>>("api/linked-user/edit", model);
    }
    public class PermissionApiService : BaseApiClient, IPermissionApiService
    {
        public PermissionApiService(string host, string name, string apiKey, ISerializerService serializer, ICompressionService compressionService, IGeneralDataService generalDataService, IHttpClientFactory httpClientFactory) : base(host, name, apiKey, serializer, compressionService, generalDataService, httpClientFactory) { }

        public Task<CoreLib.ResultList<Models.Permission.PermissionModel>> List(CoreLib.Models.PagingModel model)
            => base.PostAsync<CoreLib.ResultList<Models.Permission.PermissionModel>>("api/permission/list", model);
    }
    public class RelativeApiService : BaseApiClient, IRelativeApiService
    {
        public RelativeApiService(string host, string name, string apiKey, ISerializerService serializer, ICompressionService compressionService, IGeneralDataService generalDataService, IHttpClientFactory httpClientFactory) : base(host, name, apiKey, serializer, compressionService, generalDataService, httpClientFactory) { }

        public Task<CoreLib.Result<Guid>> Add(Models.User.CreateRelativeModel model)
            => base.PostAsync<CoreLib.Result<Guid>>("api/relative/add", model);
        public Task<CoreLib.Result<IList<Models.User.RelativeModel>>> ListByUser(BaseModel model)
            => base.PostAsync<CoreLib.Result<IList<Models.User.RelativeModel>>>("api/relative/list-by-user", model);
        public Task<CoreLib.Result<Guid>> Delete(BaseModel model)
            => base.PostAsync<CoreLib.Result<Guid>>("api/relative/delete", model);
    }
    public class RoleApiService : BaseApiClient, IRoleApiService
    {
        public RoleApiService(string host, string name, string apiKey, ISerializerService serializer, ICompressionService compressionService, IGeneralDataService generalDataService, IHttpClientFactory httpClientFactory) : base(host, name, apiKey, serializer, compressionService, generalDataService, httpClientFactory) { }

        public Task<CoreLib.Result<Guid>> Add(Models.Role.CreateRoleModel model)
            => base.PostAsync<CoreLib.Result<Guid>>("api/role/add", model);
        public Task<CoreLib.Result<Models.Role.RoleModel>> Get(Models.Role.RoleModel model)
            => base.PostAsync<CoreLib.Result<Models.Role.RoleModel>>("api/role/get", model);
        public Task<CoreLib.ResultList<Models.Role.RoleModel>> List(FilterModel model)
            => base.PostAsync<CoreLib.ResultList<Models.Role.RoleModel>>("api/role/list", model);
        public Task<CoreLib.Result<Models.Role.RoleModel>> Edit(Models.Role.UpdateRoleModel model)
            => base.PostAsync<CoreLib.Result<Models.Role.RoleModel>>("api/role/edit", model);
    }
    public class UserApiService : BaseApiClient, IUserApiService
    {
        public UserApiService(string host, string name, string apiKey, ISerializerService serializer, ICompressionService compressionService, IGeneralDataService generalDataService, IHttpClientFactory httpClientFactory) : base(host, name, apiKey, serializer, compressionService, generalDataService, httpClientFactory) { }

        public Task<CoreLib.Result<Guid>> Add(Models.User.CreateUserModel model)
            => base.PostAsync<CoreLib.Result<Guid>>("api/user/add", model);
        public Task<CoreLib.ResultList<Models.User.FullUserModel>> List(FilterModel model)
            => base.PostAsync<CoreLib.ResultList<Models.User.FullUserModel>>("api/user/list", model);
        public Task<CoreLib.Result<Models.User.LightUserModel>> Search(Models.User.SearchUserModel model)
            => base.PostAsync<CoreLib.Result<Models.User.LightUserModel>>("api/user/search", model);
        public Task<CoreLib.Result<Models.User.LightUserModel>> Edit(Models.User.UpdateUserModel model)
            => base.PostAsync<CoreLib.Result<Models.User.LightUserModel>>("api/user/edit", model);
        public Task<CoreLib.Result> Delete(BaseModel model)
            => base.PostAsync<CoreLib.Result>("api/user/delete", model);
        public Task<CoreLib.Result> AddReciept(Models.User.UpdateUserModel model)
            => base.PostAsync<CoreLib.Result>("api/user/add-reciepts", model);
    }
}
namespace ERP.MembershipService.ApiClient.Auth
{
    public class AuthApiService : BaseApiClient, IAuthApiService
    {
        public AuthApiService(string host, string name, string apiKey, ISerializerService serializer, ICompressionService compressionService, IGeneralDataService generalDataService, IHttpClientFactory httpClientFactory) : base(host, name, apiKey, serializer, compressionService, generalDataService, httpClientFactory) { }

        public Task<CoreLib.Result<object>> GenerateToken(Models.Auth.LoginModel model)
            => base.PostAsync<CoreLib.Result<object>>("api/auth/generate-token", model);
        public Task<CoreLib.Result<object>> RefreshToken(BaseModel model)
            => base.PostAsync<CoreLib.Result<object>>("api/auth/refresh-token", model);
        public Task<CoreLib.Result<object>> Register(Models.Auth.RegisterModel model)
            => base.PostAsync<CoreLib.Result<object>>("api/auth/register", model);
        public Task<CoreLib.Result<object>> Register(Models.Organization.AdvanceRegisterModel model)
            => base.PostAsync<CoreLib.Result<object>>("api/auth/advanced-register", model);
        public Task<CoreLib.Result<Models.User.LightUserModel>> Setting(BaseModel model)
            => base.PostAsync<CoreLib.Result<Models.User.LightUserModel>>("api/auth/setting", model);
        public Task<CoreLib.Result<Models.User.FullUserModel>> Profile(BaseModel model)
            => base.PostAsync<CoreLib.Result<Models.User.FullUserModel>>("api/auth/profile", model);
        public Task<CoreLib.Result<Models.User.LightUserModel>> UpdateProfile(Models.User.UpdateUserProfileModel model)
            => base.PostAsync<CoreLib.Result<Models.User.LightUserModel>>("api/auth/update-profile", model);
        public Task<CoreLib.Result<IList<Guid>>> Reciepts(BaseModel model)
            => base.PostAsync<CoreLib.Result<IList<Guid>>>("api/auth/reciepts", model);
        public Task<CoreLib.Result<bool>> ChangePassword(Models.Auth.ChangePasswordModel model)
            => base.PostAsync<CoreLib.Result<bool>>("api/auth/change-password", model);
    }
}
namespace ERP.MembershipService.ApiClient
{
    public class MembershipServiceApi : IMembershipServiceApi
    {
        public MembershipServiceApi(IAppSettings setting, ISerializerService serializer, ICompressionService compressionService, IGeneralDataService generalDataService, IHttpClientFactory httpClientFactory)
        {
             this.SystemLinkedUserApiService = new System.LinkedUserApiService(setting.MembershipService.Host, "ERPMembershipService", setting.MembershipService.ApiKey, serializer, compressionService, generalDataService, httpClientFactory);
             this.SystemUserApiService = new System.UserApiService(setting.MembershipService.Host, "ERPMembershipService", setting.MembershipService.ApiKey, serializer, compressionService, generalDataService, httpClientFactory);
             this.MembershipFeatureApiService = new Membership.FeatureApiService(setting.MembershipService.Host, "ERPMembershipService", setting.MembershipService.ApiKey, serializer, compressionService, generalDataService, httpClientFactory);
             this.MembershipLinkedUserApiService = new Membership.LinkedUserApiService(setting.MembershipService.Host, "ERPMembershipService", setting.MembershipService.ApiKey, serializer, compressionService, generalDataService, httpClientFactory);
             this.MembershipPermissionApiService = new Membership.PermissionApiService(setting.MembershipService.Host, "ERPMembershipService", setting.MembershipService.ApiKey, serializer, compressionService, generalDataService, httpClientFactory);
             this.MembershipRelativeApiService = new Membership.RelativeApiService(setting.MembershipService.Host, "ERPMembershipService", setting.MembershipService.ApiKey, serializer, compressionService, generalDataService, httpClientFactory);
             this.MembershipRoleApiService = new Membership.RoleApiService(setting.MembershipService.Host, "ERPMembershipService", setting.MembershipService.ApiKey, serializer, compressionService, generalDataService, httpClientFactory);
             this.MembershipUserApiService = new Membership.UserApiService(setting.MembershipService.Host, "ERPMembershipService", setting.MembershipService.ApiKey, serializer, compressionService, generalDataService, httpClientFactory);
             this.AuthAuthApiService = new Auth.AuthApiService(setting.MembershipService.Host, "ERPMembershipService", setting.MembershipService.ApiKey, serializer, compressionService, generalDataService, httpClientFactory);
        }
       public System.LinkedUserApiService SystemLinkedUserApiService {get; set;}
       public System.UserApiService SystemUserApiService {get; set;}
       public Membership.FeatureApiService MembershipFeatureApiService {get; set;}
       public Membership.LinkedUserApiService MembershipLinkedUserApiService {get; set;}
       public Membership.PermissionApiService MembershipPermissionApiService {get; set;}
       public Membership.RelativeApiService MembershipRelativeApiService {get; set;}
       public Membership.RoleApiService MembershipRoleApiService {get; set;}
       public Membership.UserApiService MembershipUserApiService {get; set;}
       public Auth.AuthApiService AuthAuthApiService {get; set;}
     }
}
