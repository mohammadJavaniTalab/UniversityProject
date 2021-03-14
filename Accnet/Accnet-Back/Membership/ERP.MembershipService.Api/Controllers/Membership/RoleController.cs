using System;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Models;

using ERP.MembershipService.Business.Interfaces.Shared;
using ERP.MembershipService.Core.Models;
using ERP.MembershipService.Core.Models.Role;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.MembershipService.Api.Controllers.Membership
{
    [Route("api/role")]
    [ApiController]
    

    public class RoleController : ControllerBase
    {
        private readonly IRoleBiz _roleBiz;

        public RoleController(IRoleBiz roleBiz)
        {
            _roleBiz = roleBiz;
        }

        [HttpPost("add")]
        public async Task<Result<Guid>> Add(CreateRoleModel model)
            => await _roleBiz.Add(model);

        [HttpPost("get")]
        public async Task<Result<RoleModel>> Get(RoleModel model)
            => await _roleBiz.Get(model);


        [HttpPost("list")]
        public async Task<ResultList<RoleModel>> List(FilterModel model)
            => await _roleBiz.List(model);


        [HttpPost("edit")]
        public async Task<Result<RoleModel>> Edit(UpdateRoleModel model)
            => await _roleBiz.Edit(model);
    }
}