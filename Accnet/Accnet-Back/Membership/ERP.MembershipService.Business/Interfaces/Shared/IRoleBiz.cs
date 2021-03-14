using System;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Role;

namespace ERP.MembershipService.Business.Interfaces.Shared
{
    public interface IRoleBiz
    {
        Task<Result<RoleModel>> Get(BaseModel model);
        Task<Result<Guid>> Add(CreateRoleModel model);
        Task<ResultList<RoleModel>> List(FilterModel model);
        Task<Result<RoleModel>> Edit(UpdateRoleModel model);

    }
}