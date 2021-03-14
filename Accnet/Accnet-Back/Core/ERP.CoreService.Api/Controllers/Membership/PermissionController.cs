using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Models.Permission;
using Microsoft.AspNetCore.Mvc;

namespace ERP.CoreService.Api.Controllers.Membership
{
    [Route("api/permission")]
    [ApiController]
    public class PermissionController : ControllerBase
    {
        private readonly IMembershipServiceApi _membershipServiceApi;

        public PermissionController(IMembershipServiceApi membershipServiceApi)
        {
            _membershipServiceApi = membershipServiceApi;
        }

        [HttpPost("list")]
        public async Task<ResultList<PermissionModel>> List(PagingModel model)
            => await _membershipServiceApi.MembershipPermissionApiService.List(model);
    }
}