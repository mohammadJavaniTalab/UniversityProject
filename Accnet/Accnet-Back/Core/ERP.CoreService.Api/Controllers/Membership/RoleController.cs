using System;
using System.Threading.Tasks;
using CoreLib;
using ERP.CoreService.Core.Extentions;
using ERP.MembershipService.ApiClient;
using ERP.MembershipService.ApiClient.Models.Role;
using Microsoft.AspNetCore.Mvc;
using FilterModel = ERP.CoreService.Core.Models.FilterModel;

namespace ERP.CoreService.Api.Controllers.Membership
{
    [Route("api/role")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IMembershipServiceApi _membershipServiceApi;

        public RoleController(IMembershipServiceApi membershipServiceApi)
        {
            _membershipServiceApi = membershipServiceApi;
        }

        [HttpPost("add")]
        public async Task<Result<Guid>> Add(CreateRoleModel model)
            => await _membershipServiceApi.MembershipRoleApiService.Add(model);

        [HttpPost("get")]
        public async Task<Result<RoleModel>> Get(RoleModel model)
            => await _membershipServiceApi.MembershipRoleApiService.Get(model);


        [HttpPost("list")]
        public async Task<ResultList<RoleModel>> List(FilterModel model)
            => await _membershipServiceApi.MembershipRoleApiService.List(model.ToMembershipFilterModel());


        [HttpPost("edit")]
        public async Task<Result<RoleModel>> Edit(UpdateRoleModel model)
            => await _membershipServiceApi.MembershipRoleApiService.Edit(model);
    }
}