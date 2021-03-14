using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Auth;
using ERP.MembershipService.Core.Models.Organization;
using ERP.MembershipService.Core.Models.User;

namespace ERP.MembershipService.Business.Interfaces.Shared
{
    public interface IUserBiz
    {
        Task<Result<FullUserModel>> Get(BaseModel model);
        Task<Result<object>> Register(RegisterModel model);
        Task<Result<object>> Register(AdvanceRegisterModel model);
        Task<Result<Guid>> Add(CreateUserModel model);
        Task<ResultList<FullUserModel>> List(FilterModel model);
        Task<Result<LightUserModel>> Edit(UpdateUserModel model);
        Task<Result> Delete(BaseModel model);
        Task<Result<IList<FullUserModel>>> FullListByIds(IList<Guid> ids);
        Task<Result<IList<LightUserModel>>> ListByIds(IList<Guid> ids);
        Task<Result<LightUserModel>> Setting(BaseModel model);
        Task<Result<FullUserModel>> Profile(BaseModel model);
        Task<Result<LightUserModel>> UpdateProfile(UpdateUserProfileModel model);
        Task<Result<LightUserModel>> Search(SearchUserModel model);
        Task<Result> AddReciept(UpdateUserModel model);
        Task<Result<IList<Guid>>> Reciepts(BaseModel model);
    }
}
