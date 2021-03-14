using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Permission;

namespace ERP.MembershipService.Business.Interfaces.Shared
{
    public interface IPermissionBiz
    {
        Task<ResultList<PermissionModel>> List(PagingModel model);
    }
}